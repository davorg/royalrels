# Copilot Instructions for royalrels

## Project Overview

This repository powers the **Royal Relationships** web app at <https://rels.lineofsuccession.co.uk/>, which displays the family relationship between any two British monarchs. It is part of a broader family of sites managed by the same author (see <https://lineofsuccession.co.uk/>).

## Repository Structure

```
.
├── rels                  # Main Perl script – reads monarchs.csv and writes docs/data.js
├── monarchs.csv          # Source of truth: all monarchs and key ancestors
├── lib/
│   └── Person.pm         # Perl class (uses Object::Pad) representing a person/monarch
└── docs/                 # GitHub Pages root (served as the live website)
    ├── index.html        # Single-page web UI
    ├── rels.js           # Front-end JavaScript (canvas rendering, dropdowns)
    └── data.js           # ⚠ GENERATED – do not edit by hand; regenerate with the Perl script
```

## Technology Stack

| Layer | Technology |
|---|---|
| Data processing | Perl 5 (strict + warnings) |
| OO in Perl | [`Object::Pad`](https://metacpan.org/pod/Object::Pad) |
| Genealogy logic | [`Genealogy::Relationship`](https://metacpan.org/pod/Genealogy::Relationship) CPAN module |
| CSV parsing | [`Text::ParseWords`](https://metacpan.org/pod/Text::ParseWords) (Perl core) |
| JSON serialisation | [`JSON`](https://metacpan.org/pod/JSON) CPAN module |
| Front-end | Vanilla JavaScript, HTML5 Canvas, Bootstrap 5.3.7 |
| Hosting | GitHub Pages (served from the `docs/` directory) |

## Data Model (`monarchs.csv`)

The CSV has a header row with these columns:

| Column | Description |
|---|---|
| `id` | Short alphanumeric identifier, e.g. `will1`, `hen2`, `eliz2` |
| `name` | Full display name |
| `parent` | `id` of one parent **already listed above this row** in the file; blank for the root |
| `parent2` | `id` of a second parent (optional); used when both parents are in the file, e.g. Henry VIII has `parent=elizyork` and `parent2=hen7` |
| `monarch` | `1` = this person was a monarch; `0` = non-monarch ancestor needed for lineage |
| `gender` | `m` or `f` |
| `birth` | Year, optionally prefixed with `c` for circa, e.g. `c1028` or `1133` |
| `death` | Year, or blank if still living |

**Important ordering rule:** both `parent` and `parent2` must appear **before** the child row in the CSV. If a referenced parent has not yet been parsed, the script emits a warning and skips that person.

## Regenerating `docs/data.js`

Whenever `monarchs.csv` or `lib/Person.pm` is changed, regenerate the data file:

```bash
perl rels monarchs.csv
```

This overwrites `docs/data.js` with pre-computed relationship data for every pair of monarchs. Commit both the CSV change and the updated `docs/data.js`.

## Installing Perl Dependencies

`Text::ParseWords` is a Perl core module. The other required modules are declared in `cpanfile` and can be installed with:

```bash
cpanm --installdeps .
```

Or install them individually:

```bash
cpanm Genealogy::Relationship Object::Pad JSON
```

If `cpanm` is not available, install it first:

```bash
curl -L https://cpanmin.us | perl - App::cpanminus
```

## Front-End Architecture

- **`docs/data.js`** – generated; declares three global JS variables (`rels`, `people`, `monarchs`) that the UI consumes.
- **`docs/rels.js`** – the entire front-end logic:
  - Populates the two monarch `<select>` dropdowns from `monarchs` / `people`.
  - Reads `rels[m1][m2]` to get the textual relationship and ancestor chain.
  - Renders the ancestor chain on an HTML5 `<canvas>` element.
  - Keeps the URL query string (`?from=…&to=…`) in sync so relationships are bookmarkable.
- **`docs/index.html`** – loads Bootstrap 5.3.7 from CDN, then `data.js` and `rels.js` in that order.

## Tests

There is currently **no automated test suite**. Manual verification steps:

1. Run `perl -c rels` to syntax-check the Perl script.
2. Run `perl -c lib/Person.pm` to syntax-check the class.
3. Run `perl rels monarchs.csv` and confirm `docs/data.js` is rewritten without errors.
4. Open `docs/index.html` in a browser (or via a local HTTP server) and select two monarchs to verify the relationship text and canvas diagram render correctly.

## Common Tasks

### Adding a new monarch

1. Add a row to `monarchs.csv` (maintain parent-before-child ordering; set `monarch=1`).
2. If the new monarch's lineage requires non-monarch ancestors not already in the file, add those rows first (with `monarch=0`).
3. If both of the monarch's parents are present in the file, populate both `parent` and `parent2` so that relationship calculations cross both family lines correctly.
4. Re-run `perl rels monarchs.csv` to regenerate `docs/data.js`.
5. Commit both files.

### Fixing a relationship or lineage

1. Correct the `parent` (and/or `parent2`) field in `monarchs.csv`.
2. Re-run `perl rels monarchs.csv`.
3. Commit both files.

### Modifying the Person class (`lib/Person.pm`)

The class uses `Object::Pad` syntax (`class`, `field`, `:param`, `:reader`, `method`). Keep changes consistent with that module's API. Key fields and methods:

- `id`, `name`, `monarch`, `gender`, `birth`, `death` – scalar fields, all `:param :reader`.
- `parent`, `parent2` – optional parent links (`:param :reader = undef`); hold `Person` objects, not raw ids, after the `rels` script resolves them.
- `parents()` – returns an arrayref of the parent `Person` objects that are set (used by `Genealogy::Relationship` to traverse both parent lines).
- `as_hashref()` – serialises the object to a plain hashref for JSON output, converting `parent`/`parent2` back to their `id` strings.

After any change, regenerate `docs/data.js` to verify nothing broke.

### Updating front-end display

Edit `docs/rels.js` or `docs/index.html` directly. No build step is needed for the front end.

## Known Issues / Workarounds

- **`Genealogy::Relationship` and `Object::Pad` not available in all environments.** Install them via `cpanm` before running the Perl script (see above). In sandboxed CI environments these may not be pre-installed.
- **`docs/data.js` is committed to the repository.** This avoids needing a server-side build step on GitHub Pages, but it means the file must be manually regenerated and committed whenever the data changes.

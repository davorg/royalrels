# Royal Relationships

A web app that displays the family relationship between any two British monarchs.

🔗 **Live site:** <https://rels.lineofsuccession.co.uk/>

## What it does

Select any two British monarchs from the dropdown menus and the app will calculate and display their family relationship, along with a diagram of the connecting ancestors.

## Repository structure

```
.
├── rels                  # Perl script – reads monarchs.csv and writes docs/data.js
├── monarchs.csv          # Source data: all monarchs and key ancestors
├── lib/
│   └── Person.pm         # Perl class representing a person/monarch
└── docs/                 # GitHub Pages root (the live website)
    ├── index.html
    ├── rels.js           # Front-end JavaScript
    └── data.js           # Generated – do not edit by hand
```

## Dependencies

Install the required Perl modules with [cpanminus](https://metacpan.org/pod/App::cpanminus):

```bash
cpanm --installdeps .
```

## Regenerating the data

After any change to `monarchs.csv` or `lib/Person.pm`, regenerate `docs/data.js`:

```bash
perl rels monarchs.csv
```

Commit both the changed source file(s) and the updated `docs/data.js`.

## Part of the Line of Succession family

This site is part of a broader set of tools at <https://lineofsuccession.co.uk/>.

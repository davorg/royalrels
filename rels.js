
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the dropdown elements
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');

  // Add a "Pick a monarch..." to each dropdown
  var option1Initial = document.createElement('option');
  option1Initial.text = 'Pick a monarch...';
  dropdown1.add(option1Initial);

  var option2Initial = document.createElement('option');
  option2Initial.text = 'Pick a monarch...';
  dropdown2.add(option2Initial);

  // Populate the dropdowns
  monarchs.forEach(function(monarch) {
    var option1 = document.createElement('option');
    var option2 = document.createElement('option');

    option1.text = people[monarch].name;
    option1.value = people[monarch].id;
    option2.text = people[monarch].name;
    option2.value = people[monarch].id;

    dropdown1.add(option1);
    dropdown2.add(option2);
  });

  // Add an event listener to the both dropdowns for the "change" event
  dropdown1.addEventListener('change', handleDropdownChange);
  dropdown2.addEventListener('change', handleDropdownChange);

  // Ensure the canvas is the same width as the window
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;

  // Ensure the canvas is twice the height of the window
  canvas.height = window.innerHeight * 2;
});

function handleDropdownChange() {

  // Only do anything if the user has selected a monarch in both dropdowns
  // and the monarchs are different
  if (dropdown1.selectedIndex > 0 && dropdown2.selectedIndex > 0 
      && dropdown1.selectedIndex != dropdown2.selectedIndex) {
    // Get the selected monarchs
    var monarchId1 = dropdown1.options[dropdown1.selectedIndex].value;
    var monarchId2 = dropdown2.options[dropdown2.selectedIndex].value;

    // Get rels[monarch1][monarch2] and rels[monarch2][monarch1]
    var rel1 = rels[monarchId1][monarchId2].rel;
    var rel2 = rels[monarchId2][monarchId1].rel;

    var monarch1 = people[monarchId1];
    var monarch2 = people[monarchId2];

    // Update the relationship div to say what the relationship is
    var relationshipDiv = document.getElementById('relationship');
    relationshipDiv.innerHTML = monarch1.name + ' is ' + rel1 + ' of ' + monarch2.name + '<br>'
                              + monarch2.name + ' is ' + rel2 + ' of ' + monarch1.name;

    // Get the rels[monarch1][monarch2].ancestors
    var ancestors = rels[monarchId1][monarchId2].ancestors;

    // Draw the ancestors in a canvas element with id="canvas"
    drawRelationship(ancestors);
  }
};

function drawRelationship(ancestors) {
    // Get the canvas element
    var canvas = document.getElementById('canvas');
    
    // Get the max length of the two arrays
    var maxLength = Math.max(ancestors[0].length, ancestors[1].length);
    // Set the canvas height to 100 pixels per ancestor
    canvas.height = maxLength * 100;

    // Get the canvas context
    var ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set the font
    ctx.font = '20px Arial';
    
    // Set the initial x and y coordinates
    var x = 50;
    var y = 50;
    
    var mcra = ancestors[0][0];
    var from = ancestors[0][ancestors[0].length - 1];
    var to   = ancestors[1][ancestors[1].length - 1];

    // ancestors is an array with two arrays inside it
    // ancestors[0] is the ancestors of the first monarch
    // ancestors[1] is the ancestors of the second monarch

    // If either of the arrays contains only one element, then we
    // can ignore it, because we have a direct line of descent.

    // If ancestors[0].length is 1, then just draw ancestors[1].
    if (ancestors[0].length == 1) {
      drawAncestors(ctx, ancestors[1], x, y, mcra, from, to);
    } else if (ancestors[1].length == 1) {
      // If ancestors[1].length is 1, then just draw ancestors[0].
      drawAncestors(ctx, ancestors[0], x, y, mcra, from, to);
    } else {
      // If neither array has only one element, then draw the common
      // ancestor first.
      drawAncestor(ctx, ancestors[0][0], x, y, mcra, from, to);
      // Draw a line to where the start of the first monarch's ancestors
      // will be drawn
      ctx.beginPath();
      ctx.moveTo(x + 95, y + 40);
      ctx.lineTo(x + 95, y + 80);
      ctx.stroke();
      // Draw a line to where the start of the second monarch's ancestors
      // will be drawn.
      ctx.beginPath();
      ctx.moveTo(x + 195, y + 40);
      ctx.lineTo(x + 295, y + 80);
      ctx.stroke();
      // Move down 100 pixels
      y += 100;
      var yStart = y;
      // Draw the ancestors of the first monarch
      drawAncestors(ctx, ancestors[0].slice(1, ancestors[0].length), x, y, mcra, from, to);
      // Go back to the starting y coordinate
      y = yStart;
      // Move to the right 300 pixels
      x += 300;
      // Draw the ancestors of the second monarch
      drawAncestors(ctx, ancestors[1].slice(1, ancestors[1].length), x, y, mcra, from, to);
    }
}

function drawAncestors(ctx, list, x, y, mcra, from, to) {
    // Draw each ancestor in the list
    for (var i = 0; i < list.length; i++) {
        drawAncestor(ctx, list[i], x, y, mcra, from, to);

        // if this isn't the first ancestor, draw a line from the previous
        // ancestor to this one
        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(x + 95, y - 60);
            ctx.lineTo(x + 95, y - 20);
            ctx.stroke();
        }
        // Move down 100 pixels
        y += 100;
    }
}

function drawAncestor(ctx, ancestor, x, y, mcra, from, to) {
    // Set the fillStyle to white
    ctx.fillStyle = '#ffffff';
    // If the ancestor is a monarch, then set the fillStyle to a
    // light yellow.
    if (people[ancestor].monarch == 1) {
        ctx.fillStyle = '#ffffcc';
    }
    // If the ancestor is the most recent common ancestor, then set
    // the fillStyle to a light blue.
    if (ancestor == mcra) {
        ctx.fillStyle = '#ccffff';
    }
    // If the ancestor is the first monarch, then set the fillStyle
    // to a light green.
    if (ancestor == from) {
        ctx.fillStyle = '#ccffcc';
    }
    // If the ancestor is the second monarch, then set the fillStyle
    // to a light red.
    if (ancestor == to) {
        ctx.fillStyle = '#ffcccc';
    }
    // Draw a standard-size box around the ancestor's name
    // The box needs to be large enough to contain any name from the dropdowns
    ctx.strokeRect(x - 5, y - 20, 200, 60);
    ctx.fillRect(x - 5, y - 20, 200, 60);

    // Set the fillStyle to black
    ctx.fillStyle = '#000000';

    // Draw the ancestor's name
    // If the name contains a comma, split it into two lines at the comma
    // (remove the comma)
    var name = people[ancestor].name;
    if (name.indexOf(',') > -1) {
        var names = name.split(',');
        ctx.fillText(names[0], x, y);
        ctx.fillText(names[1].trimStart(), x, y + 20);
    }
    else {
        ctx.fillText(name, x, y);
    }
}
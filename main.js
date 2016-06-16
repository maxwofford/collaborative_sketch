var toolType = 'dot';
var widthSlider;

var config = {
  apiKey: "AIzaSyDHwT5HluYshbKOdgoH7hkhW3MBmWrTiRE",
  authDomain: "collabsketch-3efc5.firebaseapp.com",
  databaseURL: "https://collabsketch-3efc5.firebaseio.com",
  storageBucket: "collabsketch-3efc5.appspot.com"
};
firebase.initializeApp(config);

var pointsData = firebase.database().ref();
var points = [];

function setup() {
  var canvas = createCanvas(400, 400);
  background(255);
  fill(0);

  widthSlider = createSlider(1, 10, 3);
  widthSlider.position(20, 40);

  pointsData.on("child_removed", function () {
    points = [];
  });
  pointsData.on("child_added", function (point) {
    points.push(point.val());
  });
  canvas.mousePressed(drawPoint);
  canvas.mouseReleased(function () {
    pointsData.push({type: "release"});
  });
  canvas.mouseMoved(function () {
    if (mouseIsPressed) {
      drawPoint();
    }
  });
}

function draw() {
  background(255);
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    if (point.type == "dot") {
      ellipse(point.x, point.y, point.width, point.width);
    } else if (i > 0 && point.type == "line" && points[i - 1].type == "line") {
      var previous = points[i - 1];
      strokeWeight(point.width);
      line(point.x, point.y, previous.x, previous.y);
    }
  }
}

function keyPressed() {
  if (keyCode == "72") {
    help();
  } else if (keyCode == "68") {
    toolType = "dot";
  } else if (keyCode == "76") {
    toolType = "line";
  }
}

function drawPoint() {
  pointsData.push({type: toolType,
                   x: mouseX,
                   y: mouseY,
                   width: widthSlider.value()});
}

$("#saveDrawing").on("click", saveDrawing);

function saveDrawing() {
  saveCanvas(window.prompt("Save as", "Painter Orpheus"));
}

$("#clearDrawing").on("click", clearDrawing);

function clearDrawing() {
  pointsData.remove();
  points = [];
}

$("#help").on("click", help);

function help() {
  alert("The following commands are implemented:\n\n" +
        "h - help\n" +
        "d - dot drawing tool\n" +
        "l - line drawing tool");
}

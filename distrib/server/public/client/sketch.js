// parameters
let p = {
  boolean: true,
  numeric: 50,
  numericMin: 0,
  numericMax: 100,
  numericStep: 1,
};

function preload() {}

// const socket = io();

function setup() {
  console.log("hello")
  createCanvas(400, 400);

  // add params to a GUI
  createParamGui(p, paramChanged);
  _paramGui.setPosition(10, 10); // can customize where GUI is drawn
  // _paramGui.hide(); // uncomment to hide for presentations

  // set colour for your frame
  select("body").style("background: #000000;");

  // don't centre
  // select('body').style('place-items: start start;')
  // _paramGui.setPosition(width + 10, 10); // can customize where GUI is drawn
}

// socket.on('mouse', (data) => {
//   print(data);
//   noStroke();
//   fill(255, 0, 0);
//   circle(data.x, data.y, 16);

// })


function draw() {
  console.log("hello")
  background(240);
}

// function keyPressed() {
//   socket.emit('key', {key})
// }

function mousePressed() {}

// function mouseDragged() {
//   noStroke();
//   fill(0, 255, 0);
//   circle(mouseX, mouseY, 16);

//   // send mouse data to server
//   let data = { x: mouseX, y: mouseY };
//   socket.emit("mouse", data);
// }


function windowResized() {}

// global callback from the settings GUI
function paramChanged(name) {}

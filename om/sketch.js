let ghosts;
let ghostImg;
let ghostImg_png;

// the model
let facemesh;

// latest model predictions
let predictions = [];

// video capture
let video;
let bodyImg;

let noseWidthImg = 25;
let imgWidth = 218;
let headHeight = 218;

let w;
let h;

let heightScaleFactor;
let widthScaleFactor;

let lx = [0];
let ly = [0];
let lz = [0];

let om1, om2, om3, om4, om5;

function setup() {
  w = windowWidth;
  h = windowHeight;
  widthScaleFactor = w / 640;
  heightScaleFactor = h / 480;
  createCanvas(windowWidth, windowHeight);
  createParamGui(p, paramChanged);
  // print(ghostImg_png)
  
  om1 = loadImage('data/om1.svg');
  om2 = loadImage('data/om2.svg');
  om3 = loadImage('data/om3.svg');
  om4 = loadImage('data/om4.svg');
  om5 = loadImage('data/om5.svg');

}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background("#FFFDD0");
  // for (g of ghosts) {
  //   g.update();
  //   g.draw();
  // }
  // drawBody();

  drawOm();

  drawFps();
}

function drawOm() {
  push();
  let x = width/2;
  let y = height/2;

  push();
  scale(1/p.z)
  translate(x+p.om1x, y+p.om1y);
  rotate(p.om1r)
  image(om1, 0, 0);
  pop();

  push();
  scale(1/p.z)
  translate(x+p.om2x, y+p.om2y);
  rotate(p.om2r)
  image(om2, 0, 0);
  pop();

  push();
  scale(1/p.z)
  translate(x+p.om3x, y+p.om3y);
  rotate(p.om3r)
  image(om3, 0, 0);
  pop();

  push();
  scale(1/p.z)
  translate(x+p.om4x, y+p.om4y);
  rotate(p.om4r)
  image(om4, 0, 0);
  pop();

  push();
  scale(1/p.z)
  translate(x+p.om5x, y+p.om5y);
  rotate(p.om5r)
  image(om5, 0, 0);
  pop();

  
  pop();
}

function paramChanged(name) {
  // if (name == "tileSize" || name == "fillScreen") {
  //   createGhosts();
  // }

  if (name == "numAgents") {
    createGhosts();
  }

  // if (name == "color") {
  //   createGhosts();
  // }
}

fps = 0;
function drawFps() {
  let a = 0.01;
  fps = a * frameRate() + (1 - a) * fps;
  stroke(255);
  strokeWeight(0.5);
  fill(0);
  textAlign(LEFT, TOP);
  textSize(20.0);
  text(this.fps.toFixed(1), 10, 10);
}
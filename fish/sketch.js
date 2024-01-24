// parameters
let p = {
  // toggle filling screen or not
  fillScreen: false,
  color: false,

  // tile size
  numAgents: 10,
  numAgentsMin: 1,
  numAgentsMax: 250,

  // fish speed
  fishSpeed: 0.5,
  fishSpeedMin: 0,
  fishSpeedMax: 1,
  fishSpeedStep: 0.05,

  // shape scale
  shapeScale: 0.5,
  shapeScaleMin: 0.1,
  shapeScaleMax: 3,
  shapeScaleStep: 0.01,

  bboxScale: 1,
  bboxScaleMin: 0,
  bboxScaleMax: 5,
};

// list of agents
let agents;

// estimate maximum distance from an agent
let maxDist;

let shape;

function setup() {
  createCanvas(600, 600);

  // add params to a GUI
  createParamGui(p, paramChanged);

  // load last params
  // s = getItem("params")

  // load the SVG shape
  shape_orange = loadImage(`data/fish_darkorange.svg`);
  shape = loadImage(`data/fish.svg`);

  // setup everything and create the agents
  createAgents();

  noCursor();
}

function draw() {
  if (p.color) {
    background(112, 173, 255);
  } else {
    background(170);
  }

  // if (p.color) {
    stroke(255, 228, 28);
    fill(255, 228, 28);
  // }
  circle(mouseX, mouseY, 10);

  // draw all the agents
  if (shape != null) {
    for (a of agents) {
      a.update();
      a.draw();
    }
  }

  
}

// create the grid of agents, one agent per grid location
function createAgents() {
  // setup the canvas
  if (p.fillScreen) {
    resizeCanvas(windowWidth, windowHeight);
  } else {
    resizeCanvas(600, 600);
  }

  maxDist = sqrt(sq(width) + sq(height));

  agents = [];

  for (let i = 0; i < p.numAgents; i++) {
    let agentshape = p.color ? shape_orange : shape;
    let ex = p.fillScreen ? windowWidth : 600;
    let ey = p.fillScreen ? windowHeight : 600;
    let a = new Agent(random(0, ex), random(0, ey), agentshape, i);
    agents.push(a)
  }

  // denominator is size of tile
  // let tiles = width / p.tileSize;
  // // step size between grid centres
  // let step = width / tiles;
  // // the length of an agent's line (diagonal line of tile)
  // let length = sqrt(step * step + step * step);

  // // create an Agent object and place it at centre of each tile
  // for (x = step / 2; x < width; x += step) {
  //   for (y = step / 2; y < height; y += step) {
  //     let a = new Agent(x, y, shape);
  //     agents.push(a);
  //   }
    
}

function keyPressed() {
  // SHIFT-S saves the current canvas
  if (key == "S") {
    save("canvas.png");
  }
}

function windowResized() {
  createAgents();
}

// global callback from the settings GUI
function paramChanged(name) {
  if (name == "tileSize" || name == "fillScreen") {
    createAgents();
  }

  if (name == "numAgents") {
    createAgents();
  }

  if (name == "color") {
    createAgents();
  }
}

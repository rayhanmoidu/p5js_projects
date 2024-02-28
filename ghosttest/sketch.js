// parameters
let p = {
  // toggle filling screen or not
  fillScreen: false,
  color: false,

  noiseFactor: 0.5,
  noiseFactorMin: 0.05,
  noiseFactorMax: 10,
  noiseFactorStep: 0.05,

  // tile size
  numAgents: 10,
  numAgentsMin: 1,
  numAgentsMax: 1000,

  // fish speed
  speed: 0.5,
  speedMin: 0,
  speedMax: 1,
  speedStep: 0.05,

  // shape scale
  shapeScale: 0.5,
  shapeScaleMin: 0.1,
  shapeScaleMax: 3,
  shapeScaleStep: 0.01,

  bboxScale: 1,
  bboxScaleMin: 0,
  bboxScaleMax: 5,

  ghostZ: 5,
};

let ghosts;
let ghostImg;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createParamGui(p, paramChanged);

  ghostImg = loadImage('data/ghost.svg');

  createGhosts();

}

function draw() {
  background(16,12,47);
  for (g of ghosts) {
    g.update();
    g.draw();
  }
}

function createGhosts() {
  ghosts = [];
  for (let i = 0; i < p.numAgents; i++) {
    let newGhost = new Ghost(i, new Vec3(random(0, width), random(0, height), random(0, 100)), ghostImg);
    ghosts.push(newGhost);
  }
  
}

function paramChanged(name) {
  if (name == "tileSize" || name == "fillScreen") {
    createGhosts();
  }

  if (name == "numAgents") {
    createGhosts();
  }

  if (name == "color") {
    createGhosts();
  }
}

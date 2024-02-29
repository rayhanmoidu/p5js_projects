// parameters
let p = {
  // toggle filling screen or not
  fillScreen: false,
  color: false,

  lr: 100,
  lrMax: 1500,
  lrMin: 0,
  lx: 300,
  lxMax: 1500,
  lxMin: 0,
  ly: 300,
  lyMax: 1500,
  lyMin: 0,
  lz: 5,
  lzMax: 1500,
  lzMin: 0,

  noiseFactor: 0.5,
  noiseFactorMin: 0.05,
  noiseFactorMax: 10,
  noiseFactorStep: 0.05,

  // tile size
  numAgents: 30,
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
  bboxScaleMax: 100,

  ghostZ: 5,
};

let ghosts;
let ghostImg;
let ghostImg_png;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createParamGui(p, paramChanged);

  ghostImg = loadImage('data/ghost.svg');
  ghostImg_png = loadImage('data/ghost.png');
  ghostImg_png.loadPixels();
  // print(ghostImg_png)

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
    let newGhost = new Ghost(i, new Vec3(random(0, width), random(0, height), random(0, 100)), ghostImg, ghostImg_png);
    ghosts.push(newGhost);
  }
  
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

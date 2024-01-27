// parameters
let p = {

  renderMode: true,

  dressTolerance: 100,
  dressToleranceMax: 2000,
  dressToleranceMin: 0,

  dressX: 5,
  dressXMax: 10,
  dressMin: 1,

  dressY: 5,
  dressYMax: 10,
  dressYMin: 1,

  mass: 50000,
  massMin: 10000,
  massMax: 150000,
  massStep: 10000,

  massFactor: 0.9,
  massFactorMin: 0.05,
  massFactorMax: 1,
  massFactorStep: 0.05,

  force: 3500,
  forceMax: 100000,
  forceMin: 0,
  forceStep: 100,

  springsPerStrand: 8,
  springsPerStrandMax: 20,
  springsPerStrandMin: 1,

  springLength: 19,
  springLengthMin: 1,
  springLengthMax: 200,

  windForce: 0,
  windForceMax: 100,
  windForceMin: 10,

  lineWeightDivisions: 2,
  lineWeightDivisionsMax: 10,
  lineWeightDivisionsMin: 1,

  numStrands: 8,
  numStrandsMax: 64,
  numStrandsMin: 1,

  hoffset: 10,
  hoffsetMax: 100,
  hoffsetMin: 1,

  voffset: 20,
  voffsetMax: 100,
  voffsetMin: 1,

  curveThreshold: 50,
  curveThresholdMin: 5,
  curveThresholdMax: 150,

  rootWidth: 5,
  rootWidthMax: 30,
  rootWidthMin: 0.1,
  rootWidthStep: 0.1,
};

canvasw = 1100;
canvash = 700;

// let hair;
// let cloth;
let character;

function reloadHair() {
  character = new Character(new Vec2(300, 100), 1);
  simulation = new Simulation(character.getSprings(), character.getParticles(), 0.5);
}

function preload() {
}

function setup() {
  // canvasw = windowWidth;
  // canvash = windowHeight;
  createCanvas(canvasw, canvash);
  createParamGui(p, paramChanged);

  reloadHair();
}

function draw() {
  background(255, 222, 252);

  simulation.addExternalForce(new Vec2(0, 9.81));
  simulation.addExternalForce(new Vec2(p.windForce, 0));
  simulation.update();
  simulation.resetExternalForces();
  character.render();
}

function mousePressed() {
}

// global callback from the settings GUI
function paramChanged(name) {
  if (name=="springLength" || name=="springsPerStrand" || name=="numStrands" || name=="hoffset" || name=="voffset") {
    reloadHair();
  }
}



 

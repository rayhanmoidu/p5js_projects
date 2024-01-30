// parameters
let p = {
  layerDistance: 3,
  layerDistanceMin: 1,
  layerDistanceMax: 300,

  speed: 0.008,
  speedMin: 0.001,
  speedMax: 0.5,
  speedStep: 0.001,

  treeCycleSpeed: 0.1,
  treeCycleSpeedMax: 1,
  treeCycleSpeedMin: 0.01,
  treeCycleSpeedStep: 0.01,

  // legLength: 100,
  // legLengthMax: 100,
  // legLengthMin: 5,

  // numLevels: 5,
  // numLevelsMin: 1,
  // numLevelsMax: 15,
  
  // branchingFactor: 2,
  // branchingFactorMin: 1,
  // branchingFactorMax: 10,

  // branchLength: 75,
  // branchLengthWMin: 10,
  // branchLengthMax: 300,
  // branchLengthStep: 5,

  // treeHeight: 150,
  // treeHeightMin: 10,
  // treeHeightMax: 300,
  // treeHeightStep: 10,

  // angleOffset: 0.6283,
  // angleOffsetMin: 0,
  // angleOffsetMax: 1.57,
  // angleOffsetStep: 0.01,

  // branchLengthFactor: 0.9,
  // branchLengthFactorMin: 0.05,
  // branchLengthFactorMax: 1,
  // branchLengthFactorStep: 0.05,

  mass: 10000,
  massMin: 10000,
  massMax: 150000,
  massStep: 10000,

  massFactor: 0.7,
  massFactorMin: 0.05,
  massFactorMax: 1,
  massFactorStep: 0.05,

  cubeDepth: 15,
  cubeDepthMin: 1,
  cubeDepthMax: 100,

  dressTolerance: 12,
  dressToleranceMax: 2000,
  dressToleranceMin: 0,

  // dressX: 5,
  // dressXMax: 10,
  // dressMin: 1,

  // dressY: 5,
  // dressYMax: 10,
  // dressYMin: 1,

  // springsPerStrand: 8,
  // springsPerStrandMax: 20,
  // springsPerStrandMin: 1,

  // springLength: 19,
  // springLengthMin: 1,
  // springLengthMax: 200,

  windForce: 250,
  windForceMax: 1000,
  windForceMin: 0,

  // lineWeightDivisions: 2,
  // lineWeightDivisionsMax: 10,
  // lineWeightDivisionsMin: 1,

  // numStrands: 8,
  // numStrandsMax: 64,
  // numStrandsMin: 1,

  // hoffset: 10,
  // hoffsetMax: 100,
  // hoffsetMin: 1,

  // voffset: 20,
  // voffsetMax: 100,
  // voffsetMin: 1,

  // curveThreshold: 50,
  // curveThresholdMin: 5,
  // curveThresholdMax: 150,

  // rootWidth: 5,
  // rootWidthMax: 30,
  // rootWidthMin: 0.1,
  // rootWidthStep: 0.1,

  dressHeight: 200,
  dressHeightMax: 600,
  dressHeightMin: 100,

  dressWidth: 67,
  dressWidthMax: 200,
  dressWidthMin: 10,

};

layerId = 0;

canvasw = 1100;
canvash = 700;

distFromLastLayer = 0;
visibleLayers = []

treeCycle = 0;
randomFactory_tree;

let stopanim = false;

function addLayer() {
  let randH = round(random(100, 250));
  treeCycle = min(1, treeCycle + p.treeCycleSpeed);
  visibleLayers.push(new Layer(randH, p.cubeDepth, randomFactory_tree.getVals(treeCycle)));
  if (treeCycle >= 1) {
    treeCycle = 0;
  }
}

function preload() {
}

function setup() {
  canvasw = windowWidth;
  canvash = windowHeight;
  createCanvas(canvasw, canvash);
  createParamGui(p, paramChanged);
  randomFactory_tree = new RandomFactory("tree");
  addLayer();
}

function draw() {
  background(255, 235, 253);
  distFromLastLayer += p.speed;

  for (let i = visibleLayers.length-1; i >=0; i--) {
      visibleLayers[i].update();
      visibleLayers[i].render();
  }

  if (distFromLastLayer > p.layerDistance) {
    addLayer();
    distFromLastLayer = 0;
  }
}

function mousePressed() {
}

// global callback from the settings GUI
function paramChanged(name) {
}



 

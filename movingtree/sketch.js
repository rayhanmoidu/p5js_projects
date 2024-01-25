// parameters
let p = {
  layerDistance: 3,
  layerDistanceMin: 1,
  layerDistanceMax: 300,

  speed: 0.2,
  speedMin: 0.001,
  speedMax: 5,
  speedStep: 0.001,

  numLevels: 5,
  numLevelsMin: 1,
  numLevelsMax: 15,
  
  branchingFactor: 2,
  branchingFactorMin: 1,
  branchingFactorMax: 10,

  branchLength: 75,
  branchLengthWMin: 10,
  branchLengthMax: 300,
  branchLengthStep: 5,

  treeHeight: 150,
  treeHeightMin: 10,
  treeHeightMax: 300,
  treeHeightStep: 10,

  angleOffset: 0.6283,
  angleOffsetMin: 0,
  angleOffsetMax: 1.57,
  angleOffsetStep: 0.01,

  branchLengthFactor: 0.9,
  branchLengthFactorMin: 0.05,
  branchLengthFactorMax: 1,
  branchLengthFactorStep: 0.05,

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
};

canvasw = 1100;
canvash = 700;

cubeDepth = 15;
distFromLastLayer = 0;
visibleLayers = []

let stopanim = false;

function addLayer() {
  let randH = round(random(100, 250));
  visibleLayers.push(new Layer(randH, cubeDepth));
}

function preload() {
}

function setup() {
  canvasw = windowWidth;
  canvash = windowHeight;
  createCanvas(canvasw, canvash);
  createParamGui(p, paramChanged);
  addLayer();
}

function draw() {
  background(255, 235, 253);
  distFromLastLayer += p.speed;

  for (let i = visibleLayers.length-1; i >=0; i--) {
    if (!stopanim) {
      visibleLayers[i].update();
    }
    let fullOpacity = i==0;
    visibleLayers[i].render(fullOpacity);
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



 

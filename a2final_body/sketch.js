// CV variables
let posenet;
let predictions = [];
let video;
let cv_helper;

// scaling between video and display
let heightScaleFactor;
let widthScaleFactor;

// global variables
let lightSources = [];
let coloredImgs = [];
let entities = [];
let shapes = [];
let prevNosePos = [];
let opticalFlow = 0;

// debug variables
let shoulderWidth = 0;

function setup() {
  noCursor();

  widthScaleFactor = windowWidth / 640;
  heightScaleFactor = windowHeight / 480;

  createCanvas(windowWidth, windowHeight);
  createParamGui(p, paramChanged);

  loadSVGs();
  createShapes();
  createEntities();

  video = createCapture(VIDEO);
  video.size(640, 480);

  facemesh = ml5.poseNet(video, modelReady);
  facemesh.on("pose", (results) => {
    predictions = results;
  });

  cv_helper = new CV_Helper();

  video.hide();
}

// creates offset packages for resulting shapes (Om, Ghost) based on hardcoded values generated in seperate sketch
function createShapes() {
  for (let i = 0; i < numShapes; i++) {
    let xOffsets = [om1x[i], om2x[i], om3x[i], om4x[i], om5x[i]];
    let yOffsets = [om1y[i], om2y[i], om3y[i], om4y[i], om5y[i]];
    let rOffsets = [om1r[i], om2r[i], om3r[i], om4r[i], om5r[i]];
    shapes.push(new Shape(getShouldPreTranslate(i), xOffsets, yOffsets, rOffsets));
  }
}

// organized automatically generated colored SVGs (data/colored) into list
function loadSVGs() {
  for (let i = 0; i <= 360; i+=10) {
    for (let k = 50; k <= 100; k+=10) {
      let newset = [];
      for (let img_count = 0; img_count < 5; img_count ++) {
        let imgString = 'data/colored/output' + img_count + "_" + i + "_50" + "_" + k + '.svg'
        let newimg = loadImage(imgString);
        newset.push(newimg);
      }
      coloredImgs.push(newset);
    }
  }
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(16, 12, 47);

  for (e of entities) {
    e.update();
    e.draw();
  }
  cv_helper.recomputeLightPositions();
}

// on startup, create entities at random locations in 3D space
function createEntities() {
  entities = [];
  for (let i = 0; i < p.numAgents; i++) {
    let e = new Entity(i, new Vec3(random(0, width), random(0, height), random(0, p.zDepth)), random(50, 150));
    entities.push(e);
  }
  
}

function paramChanged(name) {
  if (name == "numAgents") {
    createEntities();
  }
}
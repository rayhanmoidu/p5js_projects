let posenet;
let predictions = [];
let video;
let cv_helper;

let heightScaleFactor;
let widthScaleFactor;

let lightSources = [];

let coloredImgs = [];
let entities = [];

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
  createEntities();

  video = createCapture(VIDEO);
  video.size(640, 480);

  // const options = {
  //   maxFaces: 2,
  //   detectionConfidence: 0.15,
  // };

  facemesh = ml5.poseNet(video, modelReady);
  facemesh.on("pose", (results) => {
    predictions = results;
  });

  cv_helper = new CV_Helper();

  video.hide();
}

function loadSVGs() {
  for (let i = 0; i <= 360; i+=10) {
    // for (let j = 50; j <= 100; j+=10) {
      for (let k = 50; k <= 100; k+=10) {
        let newset = [];
        for (let img_count = 0; img_count < 5; img_count ++) {
          let imgString = 'data/colored/output' + img_count + "_" + i + "_50" + "_" + k + '.svg'
          let newimg = loadImage(imgString);
          newset.push(newimg);
        }
        coloredImgs.push(newset);
      }
    // }
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

  // drawFps();
}

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

fps = 0;
function drawFps() {
  let a = 0.01;
  fps = a * frameRate() + (1 - a) * fps;
  stroke(255);
  strokeWeight(0.5);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(20.0);
  text(shoulderWidth, 10, 10);
}
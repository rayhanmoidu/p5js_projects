// imgs
let windowframe;
let bust_default;
let eye_hair_mask;

// scaling between video and display
let heightScaleFactor;
let widthScaleFactor;

// cv
let facemesh;
let predictions = [];
let video;
let cv_helper;
let hasFaceCapture;

// global vars
let world_inside;
let world_outside;
let melting_bust;
let prevNosePos;

let target_face;

function preload() {
  windowframe = loadImage("data/windowframe.png");
  bust_default = loadImage("data/rayhan.png");
  target_face = loadImage("data/clown.jpg")
  eye_hair_mask = loadImage("data/eye_hair_mask.png")
}

function setup() {
  
  // canvas
  widthScaleFactor = windowWidth / 640;
  heightScaleFactor = windowHeight / 480;
  print(createCanvas(windowWidth, windowHeight, WEBGL))
  createCanvas(windowWidth, windowHeight, WEBGL).elt.getContext('2d', { willReadFrequently: true });
  createParamGui(s, paramChanged);

  // vision
  video = createCapture(VIDEO);
  video.size(640, 480);

  const options = {
    maxFaces: 1,
    detectionConfidence: 0.2,
  };

  facemesh = ml5.facemesh(video, options, modelReady);

  cv_helper = new CV_Helper();
  facemesh.on("predict", (results) => {
    predictions = results;
    hasFaceCapture = cv_helper.recomputeOpticalFlow(predictions);
  });

  video.hide();

  world_inside = new World_Inside();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(183, 183, 183);

  world_inside.update();
  world_inside.draw();
}

// global callback from the settings GUI
function paramChanged(name) {}


// scaling between video and display
let heightScaleFactor;
let widthScaleFactor;

// cv
let facemesh;
let predictions = [];
let video;
let cv_helper;

// imgs
let windowframe;

// masks
let bust_default;
let eye_hair_mask;
let eye_mask;

// buffers
let videoBust;
let previousBust;

// global vars
let world_inside;
let world_outside;

let shouldMelt = false;
let prevNosePos = 0;

let eyeImageIndex = 0;
let eyeImages = []

function preload() {
  // load images
  windowframe = loadImage("data/windowframe.png");
  bust_default = loadImage("data/defaultbust.png");
  previousBust = loadImage("data/defaultbust.png")
  eye_hair_mask = loadImage("data/EHEMask.png")
  videoBust = loadImage("data/EHEMask.png")
  eye_mask = loadImage("data/eyeMask.png")

  for (let i = 0; i < 45; i++) {
    stringname = "data/eyemask_" + i + ".png";
    let newEyeMask = loadImage(stringname);
    eyeImages.push(newEyeMask);
  }
}

function setup() {
  
  // canvas
  widthScaleFactor = windowWidth / 640;
  heightScaleFactor = windowHeight / 480;

  createCanvas(windowWidth, windowHeight, WEBGL).elt.getContext('2d', { willReadFrequently: true });
  noCursor();

  createParamGui(p, paramChanged);

  // vision
  cv_helper = new CV_Helper();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  const options = {
    maxFaces: 1,
    detectionConfidence: 0.75,
  };

  facemesh = ml5.facemesh(video, options);
  facemesh.on("predict", (results) => {
    predictions = results;
    shouldMelt = cv_helper.recomputeOpticalFlow(predictions);
  });

  // global vars
  world_inside = new World_Inside();
  world_outside = new World_Outside(s.outsideworld_w, s.outsideworld_h);
}

function draw() {
  background(183, 183, 183);

  // update
  world_outside.update();
  world_inside.update();

  // draw
  image(world_outside.getGraphicsObject(), -width/2 + s.outsideworld_offsetx, -height/2 + s.outsideworld_offsety)
  world_inside.draw();
}

function paramChanged(name) {
}


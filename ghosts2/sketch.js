// the model
let facemesh;

// latest model predictions
let predictions = [];

// video capture
let video;
let bodyImg;
let noseWidthImg = 25;
let imgWidth = 218;
let headHeight = 218;

let w;
let h;

let heightScaleFactor;
let widthScaleFactor;


function preload() {
  bodyImg = loadImage('data/body.png')
}

function setup() {
  w = windowWidth;
  h = windowHeight;
  widthScaleFactor = w / 640;
  heightScaleFactor = h / 480;
  createCanvas(w, h);

  video = createCapture(VIDEO);
  video.size(640, 480);

  // initialize the model
  const options = {
    maxFaces: 2,
    detectionConfidence: 0.15,
  };

  facemesh = ml5.facemesh(video, options, modelReady);
  facemesh.on("predict", (results) => {
    predictions = results;
  });

  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(16,12,47);
  // push();
  // // image(video, 0, 0, width/2, height); //video on canvas, position, dimensions
  // translate(width,0); // move to far corner
  // scale(-1.0,1.0);    // flip x-axis backwards
  // image(video, 0, 0, width, height); //video on canvas, position, dimensions
  // pop();

  drawBody();
  drawFps();
}

let prevNL = -1;
let prevNR = -1;

let alpha = 0.15;

function smoothing(curValue, prev) {
  lala = curValue[0];
  lala[0] = alpha*lala[0] + (1-alpha)*prev[0];
  lala[1] = alpha*lala[1] + (1-alpha)*prev[1];
  lala[2] = alpha*lala[2] + (1-alpha)*prev[2];
  return lala;
}

function drawBody() {
  predictions.forEach((p) => {
    // if (p["faceInViewConfidence"]>=1) {
      let noseLeftCorner = p.annotations["noseLeftCorner"];
      let noseRightCorner = p.annotations["noseRightCorner"];

      if (prevNL!=-1 && prevNR!=-1) {
        noseLeftCorner[0] = smoothing(noseLeftCorner, prevNL)
        noseRightCorner[0] = smoothing(noseRightCorner, prevNR)
      }

      prevNL = noseLeftCorner[0];
      prevNR = noseRightCorner[0];

      let xDiff = noseLeftCorner[0][0] - noseRightCorner[0][0];
      let scaleFactor = abs(xDiff / noseWidthImg);

      push();
 
      print(noseLeftCorner[0][0], width-noseLeftCorner[0][0])
      let dx = ((noseLeftCorner[0][0]) + xDiff/2);
      let dy = (noseLeftCorner[0][1] - headHeight/2);
      translate(width - dx*widthScaleFactor, dy*heightScaleFactor);
      scale(scaleFactor);
      image(bodyImg, 0, 0);

      pop(); 
    // }
  })
}

function keyPressed() {
  if (key === "r") {
    pg.clear();
  }
}

function mousePressed() {}

function windowResized() {}

function paramChanged(name) {}

fps = 0;
function drawFps() {
  let a = 0.01;
  fps = a * frameRate() + (1 - a) * fps;
  stroke(255);
  strokeWeight(0.5);
  fill(0);
  textAlign(LEFT, TOP);
  textSize(20.0);
  text(this.fps.toFixed(1), 10, 10);
}
// parameters
let p = {
  boundBox: true,
  annotations: false,
  labels: false,
  landmarks: false,
};

// the model
let facemesh;
// latest model predictions
let predictions = [];
// video capture
let video;

function preload() {
  emoji = loadImage('data/monkey.png')
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);

  // add params to a GUI
  createParamGui(p, paramChanged);

  // initialize the model
  const options = {
    // flipHorizontal: true, // seems to be a bug?
    maxFaces: 5,
    detectionConfidence: 0.5,
  };
  facemesh = ml5.facemesh(video, options, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", (results) => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background("#0000aa");
  // image(video, 0, 0, width, height);

  // different visualizations
  drawClown();

  // if (p.boundBox) drawBoundingBoxes();
  // if (p.landmarks) drawLandmarks();
  // if (p.annotations) drawAllAnnotations();

  // if (predictions.length > 0) {
  //   drawAnnotation(predictions[0], "silhouette")
  // }

  // debug info
  drawFps();
}

function drawClown() {
  predictions.forEach((p) => {

    let silhouette = p.annotations["silhouette"];
    let c = color(255);
    drawAnnotation(silhouette, c);

    

    // for (let n in p.annotations) {
    //   // make a rainbow
      
    //   // draw the annotation
    //   drawAnnotation(p, n, c);
    // }

    // const [lx, ly] = p.annotations['leftCheek'][0]
    // const [rx, ry] = p.annotations['rightCheek'][0]
    // stroke('#ff0000')
    // strokeWeight(10)
    // line(lx, ly, rx, ry)

    // const x = (lx + rx) / 2
    // const y = (ly + ry) / 2
    // let d = dist(lx, ly, rx, ry) * 5

    // push()
    // noStroke();
    // fill(170);
    // circle(x, y, 100, 50);
    // pop()




    // const bb = p.boundingBox;
    // // get bb coordinates
    // const x = bb.topLeft[0][0];
    // const y = bb.topLeft[0][1];
    // const w = bb.bottomRight[0][0] - x;
    // const h = bb.bottomRight[0][1] - y;

    // fill(200);
    // img = loadImage('data/monkey.jpg');
    // image(x+w/2, y+h/2);
  });
}

// draw the bounding box for first face
function drawBoundingBoxes() {
  let c = "#ff0000";

  predictions.forEach((p) => {
    const bb = p.boundingBox;
    // get bb coordinates
    const x = bb.topLeft[0][0];
    const y = bb.topLeft[0][1];
    const w = bb.bottomRight[0][0] - x;
    const h = bb.bottomRight[0][1] - y;

    // draw the bounding box
    stroke(c);
    strokeWeight(2);
    noFill();
    rect(x, y, w, h);
    // draw the confidence
    noStroke();
    fill(c);
    textAlign(LEFT, BOTTOM);
    textSize(20.0);
    text(p.faceInViewConfidence.toFixed(2), x, y - 10);
  });
}

/* list of annotations:      
silhouette
lipsLowerOuter
lipsUpperOuter
lipsUpperInner
lipsLowerInner
rightEyeUpper0
rightEyeLower0
rightEyeUpper1
rightEyeLower1
rightEyeUpper2
rightEyeLower2
rightEyeLower3
rightEyebrowUpper
rightEyebrowLower
leftEyeUpper0
leftEyeLower0
leftEyeUpper1
leftEyeLower1
leftEyeUpper2
leftEyeLower2
leftEyeLower3
leftEyebrowUpper
leftEyebrowLower
midwayBetweenEyes
noseTip
noseBottom
noseRightCorner
noseLeftCorner
rightCheek
leftCheek
*/

function drawAnnotation(
  pts,
  color,
) {
  if (pts.length == 1) {
    return;
  }

  let [px, py] = pts[0];
  fill(color);
  beginShape();
  curveVertex(px, py);
  curveVertex(px, py);
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    curveVertex(x, y);
  }
  curveVertex(px, py);
  curveVertex(px, py);
  endShape();

  // let [px, py] = pts[0];
  // for (let i = 1; i < pts.length; i++) {
  //   const [x, y] = pts[i];
  //   stroke(color);
  //   strokeWeight(1);
  //   noFill();
  //   line(px, py, x, y);
  //   px = x;
  //   py = y;
  // }
}

function drawAllAnnotations() {
  predictions.forEach((p) => {
    let keyNum = Object.keys(p.annotations).length;
    let i = 0;
    for (let n in p.annotations) {
      // make a rainbow
      let hue = map(i++, 0, keyNum, 0, 360);
      let c = color(`hsb(${hue}, 100%, 100%)`);
      // draw the annotation
      drawAnnotation(p, n, c);
    }
  });
}

// Draw dots for all detected keypoints
function drawLandmarks() {
  predictions.forEach((p) => {
    const keypoints = p.scaledMesh;

    // Draw facial keypoints.
    for (let k of keypoints) {
      const [x, y] = k;

      stroke(128);
      strokeWeight(1);
      fill(255);
      ellipse(x, y, 5, 5);
    }
  });
}

function keyPressed() {
  if (key == "?") {
    if (predictions) print(JSON.stringify(predictions, null, 2));
  } else if (key === "a") {
    drawAnnotations();
  }
}

function mousePressed() {}

function windowResized() {}

// global callback from the settings GUI
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

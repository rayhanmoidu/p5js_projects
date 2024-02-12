// parameters
let p = {
  boundBox: false,
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

let pg;

function preload() {
  emoji = loadImage('data/monkey.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
  pg.clear();

  // pg.fill(60);
  // pg.ellipse(100, 100, 500);

  video = createCapture(VIDEO);
  video.size(width, height);

  // add params to a GUI
  createParamGui(p, paramChanged);

  // initialize the model
  const options = {
    // flipHorizontal: true, // seems to be a bug?
    maxFaces: 25,
    detectionConfidence: 0.5,
  };
  print(video)
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
  background(0);
  // image(video, 0, 0, width, height);

  // different visualizations
  drawClown();

  image(pg, 0, 0);

  if (p.boundBox) drawBoundingBoxes();
  if (p.landmarks) drawLandmarks();
  if (p.annotations) drawAllAnnotations();

  // debug info
  drawFps();
}

function drawClown() {
  predictions.forEach((p) => {


      scale(2);

      let noseTip = p.annotations["noseTip"];
      let noseRightCorner = p.annotations["noseRightCorner"][0];
      let noseLeftCorner = p.annotations["noseLeftCorner"][0];
      let diffx = noseRightCorner[0] - noseLeftCorner[0];
      let diffy = noseRightCorner[1] - noseLeftCorner[1];
      let noseR = sqrt(diffx*diffx + diffy*diffy);
      noStroke();
      let opacity = min(255 * ((noseR-10)/40), 255);

    if (true) {

      let silhouette = p.annotations["silhouette"];
      let silhouette_c = color(255);
      silhouette_c.setAlpha(opacity)
      drawAnnotationShape(silhouette, silhouette_c);

      let upperLip_outer = p.annotations["lipsUpperOuter"];
      let lowerLip_outer = p.annotations["lipsLowerOuter"];
      let lips_outer = lowerLip_outer.concat(upperLip_outer.reverse()).concat([lowerLip_outer[0]])
      let lips_outer_c = color(255, 0, 0);
      lips_outer_c.setAlpha(opacity)
      drawAnnotationShape(lips_outer, lips_outer_c);

      let upperLip_inner = p.annotations["lipsUpperInner"];
      let lowerLip_inner = p.annotations["lipsLowerInner"];
      let lips_inner = lowerLip_inner.concat(upperLip_inner.reverse()).concat([lowerLip_inner[0]])
      let lips_inner_c = color(255);
      lips_inner_c.setAlpha(opacity)
      drawAnnotationShape(lips_inner, lips_inner_c);

      let leftEye1_upper = p.annotations["leftEyeUpper2"];
      let leftEye1_lower = p.annotations["leftEyeLower2"];
      let leftEye1 = leftEye1_upper.concat(leftEye1_lower.reverse()).concat([leftEye1_upper[0]])
      let leftEye1_c = color(0);
      leftEye1_c.setAlpha(opacity)
      drawAnnotationShape(leftEye1, leftEye1_c);

      let rightEye1_upper = p.annotations["rightEyeUpper2"];
      let rightEye1_lower = p.annotations["rightEyeLower2"];
      let rightEye1 = rightEye1_upper.concat(rightEye1_lower.reverse()).concat([rightEye1_upper[0]])
      let rightEye1_c = color(0);
      rightEye1_c.setAlpha(opacity)
      drawAnnotationShape(rightEye1, rightEye1_c);

      let leftEye2_upper = p.annotations["leftEyeUpper0"];
      let leftEye2_lower = p.annotations["leftEyeLower0"];
      let leftEye2 = leftEye2_upper.concat(leftEye2_lower.reverse()).concat([leftEye2_upper[0]])
      let leftEye2_c = color(255);
      leftEye2_c.setAlpha(opacity)
      drawAnnotationShape(leftEye2, leftEye2_c);

      let rightEye2_upper = p.annotations["rightEyeUpper0"];
      let rightEye2_lower = p.annotations["rightEyeLower0"];
      let rightEye2 = rightEye2_upper.concat(rightEye2_lower.reverse()).concat([rightEye2_upper[0]])
      let rightEye2_c = color(255);
      rightEye2_c.setAlpha(opacity)
      drawAnnotationShape(rightEye2, rightEye2_c);

      let leftEyebrow_upper = p.annotations["leftEyebrowUpper"];
      let leftEyebrow_lower = p.annotations["leftEyebrowLower"];
      let leftEyebrow = leftEyebrow_upper.concat(leftEyebrow_lower.reverse()).concat([leftEyebrow_upper[0]])
      let leftEyebrow_c = color(0);
      leftEyebrow_c.setAlpha(opacity);
      drawAnnotationShape(leftEyebrow, leftEyebrow_c);

      let rightEyebrow_upper = p.annotations["rightEyebrowUpper"];
      let rightEyebrow_lower = p.annotations["rightEyebrowLower"];
      let rightEyebrow = rightEyebrow_upper.concat(rightEyebrow_lower.reverse()).concat([rightEyebrow_upper[0]])
      let rightEyebrow_c = color(0);
      rightEyebrow_c.setAlpha(opacity);
      drawAnnotationShape(rightEyebrow, rightEyebrow_c);



      fill(255, 0, 0, opacity);
      ellipse(noseTip[0][0], noseTip[0][1], noseR);

    }

    // pg.scale(2);
    pg.noStroke();
    let dotColor = color(255, 0, 0);
    dotColor.setAlpha(opacity);
    pg.fill(dotColor);
    pg.ellipse(noseTip[0][0], noseTip[0][1], noseR);
    // pg.scale(1/2);
    print(pg);

    // drawAnnotationShape(leftEye2_lower, leftEye2_c);
  });
}

function drawAnnotationShape(
  pts,
  color,
) {
  if (pts.length == 1) {
    return;
  }

  let [px, py] = pts[0];
  fill(color);
  noStroke();
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
  prediction,
  name,
  color = "#0000ff",
  addLabel = p.labels
) {
  let pts = prediction.annotations[name];
  if (pts.length == 1) {
    const [x, y] = pts[0];
    noStroke();
    fill(color);
    ellipse(x, y, 8);
  } else {
    let [px, py] = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const [x, y] = pts[i];
      stroke(color);
      strokeWeight(1);
      noFill();
      line(px, py, x, y);
      px = x;
      py = y;
    }
  }

  if (addLabel) {
    const [x, y] = pts[0];
    noStroke();
    fill(color);
    textSize(10);
    textAlign(LEFT, BOTTOM);
    text(name, x + 8, y - 8);
  }
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
  } else if (key === "r") {
    pg.clear();
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

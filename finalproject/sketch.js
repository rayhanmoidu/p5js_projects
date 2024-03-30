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

  // vars
  // melting_bust = createGraphics(bust_default.width/2, bust_default.height/2, WEBGL);
  // melting_bust.setAttributes("alpha", true);
  // melting_bust.loadPixels();
  // bust_default.loadPixels();

  // print(melting_bust.pixels);
  // this.bust.loadPixels();
        // bust_default.loadPixels();

  world_inside = new World_Inside();

}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(183, 183, 183);

  world_inside.update();
  world_inside.draw();

  // window frame

  // debug info
}

// // draw the bounding box for first face
// function drawBoundingBoxes() {
//   let c = "#ff0000";

//   predictions.forEach((p) => {
//     const bb = p.boundingBox;
//     // get bb coordinates
//     const x = bb.topLeft[0][0];
//     const y = bb.topLeft[0][1];
//     const w = bb.bottomRight[0][0] - x;
//     const h = bb.bottomRight[0][1] - y;

//     // draw the bounding box
//     stroke(c);
//     strokeWeight(2);
//     noFill();
//     rect(x, y, w, h);
//     // draw the confidence
//     noStroke();
//     fill(c);
//     textAlign(LEFT, BOTTOM);
//     textSize(20.0);
//     text(p.faceInViewConfidence.toFixed(2), x, y - 10);
//   });
// }

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

// function drawAnnotation(
//   prediction,
//   name,
//   color = "#0000ff",
//   addLabel = p.labels
// ) {
//   let pts = prediction.annotations[name];
//   if (pts.length == 1) {
//     const [x, y] = pts[0];
//     noStroke();
//     fill(color);
//     ellipse(x, y, 8);
//   } else {
//     let [px, py] = pts[0];
//     for (let i = 1; i < pts.length; i++) {
//       const [x, y] = pts[i];
//       stroke(color);
//       strokeWeight(1);
//       noFill();
//       line(px, py, x, y);
//       px = x;
//       py = y;
//     }
//   }

//   if (addLabel) {
//     const [x, y] = pts[0];
//     noStroke();
//     fill(color);
//     textSize(10);
//     textAlign(LEFT, BOTTOM);
//     text(name, x + 8, y - 8);
//   }
// }

// function drawAllAnnotations() {
//   predictions.forEach((p) => {
//     let keyNum = Object.keys(p.annotations).length;
//     let i = 0;
//     for (let n in p.annotations) {
//       // make a rainbow
//       let hue = map(i++, 0, keyNum, 0, 360);
//       let c = color(`hsb(${hue}, 100%, 100%)`);
//       // draw the annotation
//       drawAnnotation(p, n, c);
//     }
//   });
// }

// // Draw dots for all detected keypoints
// function drawLandmarks() {
//   predictions.forEach((p) => {
//     const keypoints = p.scaledMesh;

//     // Draw facial keypoints.
//     for (let k of keypoints) {
//       const [x, y] = k;

//       stroke(128);
//       strokeWeight(1);
//       fill(255);
//       ellipse(x, y, 5, 5);
//     }
//   });
// }

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


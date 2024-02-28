// the model
let facemesh;

// latest model predictions
let predictions = [];

// video capture
let video;

let noseTip_prevX = NaN;
let noseTip_prevY = NaN;
let nose_dx = 0;
let nose_dy = 0;

let pg;

function preload() {
  emoji = loadImage('data/monkey.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
  pg.scale(2);
  pg.clear();

  video = createCapture(VIDEO);
  video.size(width, height);

  // initialize the model
  const options = {
    maxFaces: 1,
    detectionConfidence: 1,
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
  background(0);

  image(pg, 0, 0);
  drawClown();

  pg.noStroke();
  let dotColor = color(0);
  dotColor.setAlpha(10);
  pg.fill(dotColor);
  pg.rect(0, 0, width, height);
}

function drawClown() {
  predictions.forEach((p) => {

    if (p["faceInViewConfidence"]>=0.95) {
      scale(2);

      let noseTip = p.annotations["noseTip"];
      if (!isNaN(noseTip_prevX) && !isNaN(noseTip_prevY)) {
        nose_dx = noseTip[0][0] - noseTip_prevX;
        nose_dy = noseTip[0][1] - noseTip_prevY;
      }

      noseTip_prevX = noseTip[0][0];
      noseTip_prevY = noseTip[0][1];
      

      let noseRightCorner = p.annotations["noseRightCorner"][0];
      let noseLeftCorner = p.annotations["noseLeftCorner"][0];
      let diffx = noseRightCorner[0] - noseLeftCorner[0];
      let diffy = noseRightCorner[1] - noseLeftCorner[1];
      let noseR = sqrt(diffx*diffx + diffy*diffy);
      noStroke();
      let opacity = min(255 * ((noseR-10)/30), 255);


      let silhouette = p.annotations["silhouette"];
      let silhouette_c = color(255);
      silhouette_c.setAlpha(opacity)
      drawAnnotationShape(silhouette, silhouette_c);

      drawShape(p, "lipsUpperOuter", "lipsLowerOuter", color(255, 0, 0), opacity);
      drawShape(p, "lipsUpperInner", "lipsLowerInner", color(255), opacity);

      drawShape(p, "leftEyeUpper2", "leftEyeLower2", color(0), opacity);
      drawShape(p, "rightEyeUpper2", "rightEyeLower2", color(0), opacity);

      drawShape(p, "leftEyeUpper0", "leftEyeLower0", color(255), opacity);
      drawShape(p, "rightEyeUpper0", "rightEyeLower0", color(255), opacity);

      drawShape(p, "leftEyebrowUpper", "leftEyebrowLower", color(0), opacity);
      drawShape(p, "rightEyebrowUpper", "rightEyebrowLower", color(0), opacity);

      fill(255, 0, 0, opacity);
      ellipse(noseTip[0][0], noseTip[0][1], noseR);


      let dist2 = (nose_dx*nose_dx + nose_dy*nose_dy);
      let threshold = 150;
      let fact = dist2 / threshold;
      if (fact > 1) {

        numSplats = random(5, 10) * fact;
        for (let j = 0; j < numSplats; j++) {
          let fx = random(0, 100 * fact);
          let fy = random(0, 100 * fact);
          let dx = nose_dx / sqrt(dist2);
          let dy = nose_dy / sqrt(dist2);
          let rScale = random(0.1, 0.15*fact);
          pg.noStroke();
          let dotColor = color(255, 0, 0);
          dotColor.setAlpha(opacity);
          pg.fill(dotColor);
          pg.ellipse(noseTip[0][0] + (fx*dx), noseTip[0][1] + (fy*dy), noseR*rScale);

        }
      }
    }
  });
}

function drawShape(p, key1, key2, myColor, opacity) {
  let upperLip_outer = p.annotations[key1];
  let lowerLip_outer = p.annotations[key2];
  let lips_outer = lowerLip_outer.concat(upperLip_outer.reverse()).concat([lowerLip_outer[0]])
  let lips_outer_c = myColor;
  lips_outer_c.setAlpha(opacity)
  drawAnnotationShape(lips_outer, lips_outer_c);
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


function keyPressed() {
  if (key === "r") {
    pg.clear();
  }
}

function mousePressed() {}

function windowResized() {}

function paramChanged(name) {}
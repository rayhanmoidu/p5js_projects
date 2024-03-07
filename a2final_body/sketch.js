// the model
let posenet;

// latest model predictions
let predictions = [];

// video capture
let video;

let w;
let h;

let heightScaleFactor;
let widthScaleFactor;

let om1, om2, om3, om4, om5;

let lx = [];
let ly = [];
let lz = [];

let randomImgs = [];
let om_agents = [];

let opticalFlow = 0;
let globalOffset = 0;

let lalaxdiff = 0;

function setup() {
  w = windowWidth;
  h = windowHeight;
  widthScaleFactor = w / 640;
  heightScaleFactor = h / 480;
  createCanvas(windowWidth, windowHeight);
  createParamGui(p, paramChanged);

  om1 = loadImage('data/om1.svg');
  om2 = loadImage('data/om2.svg');
  om3 = loadImage('data/om3.svg');
  om4 = loadImage('data/om4.svg');
  om5 = loadImage('data/om5.svg');

  loadImages();

  createOmAgents();

  lx.push(0)
  ly.push(0)
  lz.push(0)

  video = createCapture(VIDEO);
  video.size(640, 480);

  // initialize the model
  // const options = {
  //   maxFaces: 2,
  //   detectionConfidence: 0.15,
  // };

  facemesh = ml5.poseNet(video, modelReady);
  facemesh.on("pose", (results) => {
    predictions = results;
  });

  video.hide();

}

function loadImages() {
  for (let i = 0; i <= 360; i+=10) {
    // for (let j = 50; j <= 100; j+=10) {
      for (let k = 50; k <= 100; k+=10) {
        let newset = [];
        for (let img_count = 0; img_count < 5; img_count ++) {
          let imgString = 'data/colored/output' + img_count + "_" + i + "_50" + "_" + k + '.svg'
          let newimg = loadImage(imgString);
          newset.push(newimg);
        }
        randomImgs.push(newset);
      }
    // }
  }

}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background("#FFFDD0");

  // background(16,12,47);
  for (om of om_agents) {
    om.update();
    om.draw();
  }
  recomputeLightPositions();

  // opticalFlow = getOpticalFlow();

  // drawAllAnnotations();

  // for (let i = 0; i < lx.length; i++) {
  //   fill(100);
  //   circle(lx[i], ly[i], 50);
  // }

  drawFps();
}

function drawAnnotation(prediction, name, color = "#0000ff") {
  let a = prediction.pose[name];
  const x = a.x;
  const y = a.y;
  noStroke();
  fill(color);
  ellipse(x, y, 12);
}

function drawAllAnnotations() {
  predictions.forEach((p) => {
    let keyNum = Object.keys(p.pose).length;
    let i = 0;
    for (let n in p.pose) {
      if (n == "keypoints" || n == "score") continue;
      // make a rainbow
      let hue = map(i++, 0, keyNum, 0, 360);
      let c = color(`hsb(${hue}, 100%, 100%)`);
      // draw the annotation
      drawAnnotation(p, n, c);
    }
  });
}

let prevNL = [];
let prevNR = [];

let prevNoseX = -1;
let prevNoseY = -1;

let alpha = 0.2;

function smoothing(curValue, prev) {
  lala = curValue;
  lala.x = alpha*lala.x + (1-alpha)*prev.x;
  lala.y = alpha*lala.y + (1-alpha)*prev.y;
  // lala[2] = alpha*lala[2] + (1-alpha)*prev[2];
  return lala;
}

let xDiffMin = 10000000;
let xDiffMax = -1;

function getPrevIndex(leftShoulder, rightShoulder) {
  let finalI = -1;
  let minDiff = 1000000000;
  for (let i = 0; i < prevNL.length; i++) {
    let diffxL = abs(leftShoulder.x - prevNL[i].x);
    let diffyL = abs(leftShoulder.y - prevNL[i].y);
    let diffxR = abs(rightShoulder.x - prevNR[i].x);
    let diffyR = abs(rightShoulder.y - prevNR[i].y);

    let diffFactor = diffxL + diffxR + diffyL + diffyR;
    if (diffFactor < minDiff) {
      minDiff = diffFactor;
      finalI = i;
    }
  }
  return finalI;
}

function getNoseDiff(preds) {
  closestNoseX = -1;
  closestNoseY = -1;
  closestDiff = 0;
  if (prevNoseX!=-1 && prevNoseY!=-1) {
    closestDiff = 10000000;
    preds.forEach((pred, i) => { 
      let curNose = pred.pose["nose"];
      let diff = abs(curNose.x - prevNoseX) + abs(curNose.y - prevNoseY);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestNoseX = curNose.x;
        closestNoseY = curNose.y;
      }
    });
    prevNoseX = closestNoseX;
    prevNoseY = closestNoseY;
  } else if (preds.length > 0) {
    prevNoseX = preds[0].pose["nose"].x;
    prevNoseY = preds[0].pose["nose"].y;
  }
  
  return closestDiff;
}

function recomputeLightPositions() {
  let confidencethreshold = 0.5;
  numPredictions = 0;

  actualPredictions = [];

  for (let i = 0; i < predictions.length; i++) {
    // print(predictions[i].pose["score"])
    if (predictions[i].pose["score"] > confidencethreshold) {
      numPredictions += 1;
      actualPredictions.push(predictions[i]);
    }
  }

  if (lx.length > numPredictions) {
    lx = lx.slice(0, numPredictions);
    ly = ly.slice(0, numPredictions);
    lz = lz.slice(0, numPredictions);
    prevNL = prevNL.slice(0, numPredictions);
    prevNR = prevNR.slice(0, numPredictions);
  } else if (lx.length < numPredictions) {
    for (let i = 0; i < numPredictions-lx.length; i++) {
      lx.push(0);
      ly.push(0);
      lz.push(0);
      prevNR.push(-1)
      prevNL.push(-1)
    }
  }

  newOpticalFlow = getNoseDiff(actualPredictions);

  // if (newOpticalFlow < opticalFlow - 0.1) {
  //   newOpticalFlow = opticalFlow - 0.1;
  // }
  opticalFlow = newOpticalFlow;


  actualPredictions.forEach((pred, i) => {
    let leftShoulder = pred.pose["leftShoulder"];
    let rightShoulder = pred.pose["rightShoulder"];

    // let nose = pred.pose["nose"];
    // getNoseDiff(nos)

    if (leftShoulder.x && rightShoulder.x && leftShoulder.y && rightShoulder.y) {
      let middlePosX = (leftShoulder.x + rightShoulder.x) / 2;
      let middlePosY = (leftShoulder.y + rightShoulder.y) / 2;

      lx[i] = width - middlePosX*widthScaleFactor;
      ly[i] = middlePosY*heightScaleFactor;

      let xDiff = abs(leftShoulder.x - rightShoulder.x);
      if (xDiff > xDiffMax) {
        xDiffMax = xDiff;
      }
      if (xDiff < xDiffMin) {
        xDiffMin = xDiff;
      }

      lalaxdiff = xDiff;
      // print(xDiff)

      // lz[i] = (0.00283446712)*(xDiff-30)*(xDiff-30)
      // lz[i] = sqrt(600*xDiff)
      xDiff = min(250, xDiff);

      lz[i] = map(xDiff, 30, 250, 0, int(p.zDepth));
      lz[i] = int(p.zDepth) - lz[i];
      // print(lz[i])
    }
  })
}

function createOmAgents() {
  om_agents = [];
  for (let i = 0; i < p.numAgents; i++) {
    let om_agent = new Om(i, new Vec3(random(0, width), random(0, height), random(0, p.zDepth)), random(50, 150));
    om_agents.push(om_agent);
  }
  
}

function paramChanged(name) {
  if (name == "numAgents") {
    createOmAgents();
  }
  // if (name == "lx" || name=="ly" || name=="lz") {
  //   lx[0] = p.lx;
  //   ly[0] = p.ly;
  //   lz[0] = p.lz;
  // }
  
}

fps = 0;
function drawFps() {
  let a = 0.01;
  fps = a * frameRate() + (1 - a) * fps;
  stroke(255);
  strokeWeight(0.5);
  fill(0);
  textAlign(LEFT, TOP);
  textSize(20.0);
  text(lalaxdiff, 10, 10);
}
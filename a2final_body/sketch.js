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

let lx = [0];
let ly = [0];
let lz = [0];

let randomImgs = [];
let om_agents = [];


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

function recomputeLightPositions() {
  let confidencethreshold = 0.2;
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

  actualPredictions.forEach((pred, i) => {
    print(pred)
    // print(pred)
    let leftShoulder = pred.pose["leftShoulder"];
    let rightShoulder = pred.pose["rightShoulder"];

    if (leftShoulder.x && rightShoulder.x && leftShoulder.y && rightShoulder.y) {
      let middlePosX = (leftShoulder.x + rightShoulder.x) / 2;
      let middlePosY = (leftShoulder.y + rightShoulder.y) / 2;

      lx[i] = width - middlePosX*widthScaleFactor;
      ly[i] = middlePosY*heightScaleFactor;

      // let ind = i;

      // if (prevNL[ind] && prevNR[ind] && prevNL[ind].x && prevNL[ind].y && prevNR[ind].x && prevNR[ind].y) {
      //   // print("SMOOTHING")
      //   leftShoulder = smoothing(leftShoulder, prevNL[ind])
      //   rightShoulder = smoothing(rightShoulder, prevNR[ind])
      // }

      // prevNL[ind] = leftShoulder;
      // prevNR[ind] = rightShoulder;

      let xDiff = abs(leftShoulder.x - rightShoulder.x);
      if (xDiff > xDiffMax) {
        xDiffMax = xDiff;
      }
      if (xDiff < xDiffMin) {
        xDiffMin = xDiff;
      }

      lz[i] = map(xDiff, 30, 450, 0, int(p.zDepth));
      lz[i] = int(p.zDepth) - lz[i];
    }
    // lz[i] = 0;

    // print(xDiffMin, xDiffMax)

    // print(lx, ly, lz)

    // print(leftShoulder, rightShoulder)
    // if (p["faceInViewConfidence"]>=1) {
      // let noseLeftCorner = pred.annotations["noseLeftCorner"];
      // let noseRightCorner = pred.annotations["noseRightCorner"];

      // let noseTip = pred.annotations["noseTip"];

      // lx[i] = width - noseTip[0][0]*widthScaleFactor;
      // ly[i] = noseTip[0][1]*heightScaleFactor;

      // if (prevNL[i]!=-1 && prevNR[i]!=-1) {
      //   noseLeftCorner[0] = smoothing(noseLeftCorner, prevNL[i])
      //   noseRightCorner[0] = smoothing(noseRightCorner, prevNR[i])
      // }

      // prevNL[i] = noseLeftCorner[0];
      // prevNR[i] = noseRightCorner[0];

      // let xDiff = noseLeftCorner[0][0] - noseRightCorner[0][0];
      // lz[i] = map(xDiff, 10, 80, 0, int(p.zDepth));
      // lz[i] = int(p.zDepth) - lz[i];
    // }
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
  text(this.fps.toFixed(1), 10, 10);
}
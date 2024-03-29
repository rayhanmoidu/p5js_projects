// the model
let facemesh;

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

  drawFps();
}

let prevNL = [];
let prevNR = [];

let alpha = 0.5;

function smoothing(curValue, prev) {
  lala = curValue[0];
  lala[0] = alpha*lala[0] + (1-alpha)*prev[0];
  lala[1] = alpha*lala[1] + (1-alpha)*prev[1];
  lala[2] = alpha*lala[2] + (1-alpha)*prev[2];
  return lala;
}

function recomputeLightPositions() {
  if (lx.length > predictions.length) {
    lx = lx.slice(0, predictions.length);
    ly = ly.slice(0, predictions.length);
    lz = lz.slice(0, predictions.length);
    prevNL = prevNL.slice(0, predictions.length);
    prevNR = prevNR.slice(0, predictions.length);
  } else if (lx.length < predictions.length) {
    for (let i = 0; i < predictions.length-lx.length; i++) {
      lx.push(0);
      ly.push(0);
      lz.push(0);
      prevNR.push(-1)
      prevNL.push(-1)
    }
  }

  predictions.forEach((pred, i) => {
    // if (p["faceInViewConfidence"]>=1) {
      let noseLeftCorner = pred.annotations["noseLeftCorner"];
      let noseRightCorner = pred.annotations["noseRightCorner"];

      let noseTip = pred.annotations["noseTip"];

      lx[i] = width - noseTip[0][0]*widthScaleFactor;
      ly[i] = noseTip[0][1]*heightScaleFactor;

      if (prevNL[i]!=-1 && prevNR[i]!=-1) {
        // print(noseLeftCorner[0])
        noseLeftCorner[0] = smoothing(noseLeftCorner, prevNL[i])
        noseRightCorner[0] = smoothing(noseRightCorner, prevNR[i])
      }

      prevNL[i] = noseLeftCorner[0];
      prevNR[i] = noseRightCorner[0];

      let xDiff = noseLeftCorner[0][0] - noseRightCorner[0][0];
      lz[i] = map(xDiff, 10, 80, 0, int(p.zDepth));
      lz[i] = int(p.zDepth) - lz[i];


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
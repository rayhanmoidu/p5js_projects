// imgs
let windowframe;
let bust_default;
let eye_hair_mask;
let bust_dynamic;
let bust_previous;
let shirtmask;
let houndstooth;

// scaling between video and display
let heightScaleFactor;
let widthScaleFactor;

// cv
let facemesh;
let predictions = [];
let video;
let cv_helper;
let did_melt;

let eyeMaskIndex = 0;

// global vars
let world_inside;
let world_outside;
let melting_bust;
let prevNosePos;

let target_face;

let lala1 = 0;
let lala2 = 0;

let lalala1 = []
let lalala2 = []

let eyeMasks = []

function preload() {
  windowframe = loadImage("data/finalwindowframe.png");
  bust_default = loadImage("data/rayhan_700.png");
  target_face = loadImage("data/clown.jpg")
  eye_hair_mask = loadImage("data/hairmask_700.png")
  bust_dynamic = loadImage("data/hairmask_700.png")
  bust_previous = loadImage("data/rayhan_700.png")
  eye_mask = loadImage("data/new_eye_mask.png")
  shirtmask = loadImage("data/shirtmask.png")
  houndstooth = loadImage("data/houndstooth3.png")



  for (let i = 0; i < 45; i++) {
    stringname = "data/eyemask_" + i + ".png";
    let newEyeMask = loadImage(stringname);
    eyeMasks.push(newEyeMask);
  }
  // print(eyeMasks.length)
}

function setup() {
  
  // canvas
  widthScaleFactor = windowWidth / 640;
  heightScaleFactor = windowHeight / 480;
  createCanvas(windowWidth, windowHeight, WEBGL).elt.getContext('2d', { willReadFrequently: true });
  createParamGui(s, paramChanged);

  // vision
  video = createCapture(VIDEO);
  video.size(640, 480);

  const options = {
    maxFaces: 1,
    detectionConfidence: 0.75,
  };

  facemesh = ml5.facemesh(video, options, modelReady);

  cv_helper = new CV_Helper();
  facemesh.on("predict", (results) => {
    predictions = results;
    did_melt = cv_helper.recomputeOpticalFlow(predictions);
  });

  video.hide();

  world_inside = new World_Inside();
  world_outside = new World_Outside(s.w, s.h);
  
  // createShirt();

  noCursor();
}

function createShirt() {

  shirtmask.loadPixels();
  houndstooth.loadPixels();

  for (let i = 0; i < shirtmask.pixels.length; i+=4) {
    for (let j = 0; j < 4; j++) {
      if (shirtmask.pixels[i+j]) {
        shirtmask.pixels[i + j] = houndstooth.pixels[(i+j)%houndstooth.pixels.length]
      }
    }
  }

  shirtmask.updatePixels();

}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(183, 183, 183);

  world_inside.update();
  world_outside.update();

  // world_inside.draw();
  let lala = world_outside.getGraphicsObject();
  image(lala, -width/2 + s.woffsetx, -height/2 + s.woffsety)
  world_inside.draw();

  // scale(0.65)
  // image(shirtmask, (width*0.325), height/2)

  // image(video, -width/2, -height/2)
  // drawBoundingBoxes();

  // for (let i = 0; i < lalala1.length; i++) {
  //   fill(100)
  //   noStroke();
  //   circle(lalala2[i] - width/2, lalala1[i] - height/2, 5)
  // }

//   fill(255)
//   circle(lala2 - width/2, lala1 - height/2, 50)
}

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
    rect(x-width/2, y-height/2, w, h);
  });
}

// global callback from the settings GUI
function paramChanged(name) {
  if (name == "w" || name == "h") {
    // resizeCanvas(s.w, s.h)
    world_outside = new World_Outside(s.w, s.h);
  }
}


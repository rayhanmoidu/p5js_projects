// parameters
let p = {
  // fft smoothing
  smoothing: 0.8,
  smoothingMin: 0.01,
  smoothingMax: 0.99,
  smoothingStep: 0.01,

  pixelSize: 2,
  pixelSizeMin: 1,
  pixelSizeMax: 64,

  zoomFactor: 0.25,
  zoomFactorMin: 0.05,
  zoomFactorMax: 2,
  zoomFactorStep:0.05,
};

let particleSize = 30;

let canvasw = 520;
let canvash = 800;

let particle;
let camera;

let timeStep = 0.25;

// background image
let img_w = 0;
let img_h = 0;

// my sound file
let sound;
let prevAmplitude = 0;
let isIncreasing = false;

// amplitude analyzer
let amplitude;

function preload() {
  sound = loadSound("data/chopin_prelude.wav");
  img = loadImage("data/laleocadia.jpeg");
}

function setup() {
  img_w = img.width;
  img_h = img.height;

  createCanvas(canvasw, canvash);

  particle = new Particle(new Vec2(0, 0), 5);
  camera = new Vec2(0, 0);

  // add params to a GUI
  createParamGui(p, paramChanged);

  // sound.play();
  sound.setLoop(true);
  img.loadPixels();
  initalizeAnalysis();
}

function initalizeAnalysis() {
  print(`amplitude with ${p.smoothing}`);
  if (amplitude == null) {
    // create a new amplitude analysis object
    amplitude = new p5.Amplitude(p.smoothing);
    amplitude.setInput(sound);
  }
  // parameters to tweak amplitude analysis
  amplitude.smooth(p.smoothing);
  // normalization
  amplitude.toggleNormalize(false);
}

function setPixel(x, y, color) {
  for (let i = 0; i < p.pixelSize; i++) {
    for (let j = 0; j < p.pixelSize; j++) {
      set(x + i, y + j, color);
    }
  }
}

function draw() {

  
  // print(img.pixels)
  let curAmplitude = amplitude.getLevel();
  let encounteredNewNote = false;

  if (curAmplitude > prevAmplitude*1.1 && !isIncreasing) {
    isIncreasing = true
    encounteredNewNote = true;
  } else if (curAmplitude < prevAmplitude) {
    isIncreasing = false;
  }

  if (encounteredNewNote) {
    particle.computeNewPosition_bounce(timeStep);
  } else {
    particle.computeNewPosition(timeStep);
  }

  let camerapos = particle.getPos();
  let imagePos_x = camerapos.getX() % img_w;
  let imagePos_y = camerapos.getY() % img_h;
  let numPixels_x = (canvasw / p.pixelSize);
  let numPixels_y = (canvash / p.pixelSize);
  for (let i = 0; i < numPixels_x; i++) {
    for (let j = 0; j < numPixels_y; j++) {
      let imageSamplePoint_x = abs(round(imagePos_x + i*p.pixelSize/p.zoomFactor)) % img_w; 
      let imageSamplePoint_y = abs(round(imagePos_y + j*p.pixelSize/p.zoomFactor)) % img_h;
      // if (imageSamplePoint_x > img_w) {
      //   imageSamplePoint_x -= img_w;
      // }
      // if (imageSamplePoint_y > img_h) {
      //   imageSamplePoint_y -= img_h;
      // }
      let color_r = img.pixels[(imageSamplePoint_x*img_w + imageSamplePoint_y)*4];
      let color_g = img.pixels[(imageSamplePoint_x*img_w + imageSamplePoint_y)*4 + 1];
      let color_b = img.pixels[(imageSamplePoint_x*img_w + imageSamplePoint_y)*4 + 2];
      let color_a = img.pixels[(imageSamplePoint_x*img_w + imageSamplePoint_y)*4 + 3];
      let newcolor = color(color_r, color_g, color_b);
      setPixel(i*p.pixelSize, j*p.pixelSize, newcolor);
    }
  }
  updatePixels();


  // background(100);

  // visualize amplitude
  // let d = map(level, 0, 1, 0, height * 2);
  noStroke();
  fill(255, 0, 0, 100);
  // circle(canvasw/2, canvash/2, particleSize);

  if (encounteredNewNote) {
    let linelength = 25;
    stroke(5);
    strokeWeight(5);
    fill(0)
    let pos = particle.getPos();
    let v = particle.getV();
    let vx = -v.getX() / v.length2();
    let vy = -v.getY() / v.length2();
    let thetaOffset = random(-PI/16, PI/16);

    vx = vx*cos(thetaOffset) - vy*sin(thetaOffset);
    vy = vy*cos(thetaOffset) + vx*sin(thetaOffset);
    let len = sqrt(vx*vx + vy*vy);
    vx /= len;
    vy /= len;
    // print(sqrt(vx*vx + vy*vy))

    let linePosX = (canvasw/2) + (particleSize/2)*vx;
    let linePosY = (canvash/2) + (particleSize/2)*vy;

    // circle(linePosX, linePosY, 5);
    // let theta = random(0, PI/8)
    
    let theta = (2*PI - atan(vx / vy));

    particle.adjustPrevPos(theta);

    line_ep_offsetx = linelength * cos(theta);
    line_ep_offsety = linelength * sin(theta);
    // print(vx + vy)
    // line(linePosX - line_ep_offsetx, linePosY - line_ep_offsety, linePosX + line_ep_offsetx, linePosY + line_ep_offsety)
    print("hi");
  }

  prevAmplitude = curAmplitude;

}

function keyPressed() {
  if ((key = " ")) {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.play();
    }
  }
}

function mousePressed() {}

function windowResized() {}

// global callback from the settings GUI
function paramChanged(name) {
  if (name == "bins" || name == "smoothing") {
    initalizeAnalysis();
  }
}

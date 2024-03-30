/*
 * mixed modes demo
 *   Mix of WEBGL 3D and normal 2D p5 rendering modes.
 */

let s = {
  fx: 0,
  fxMax: 5,
  fxMin: -5,
  fxStep: 0.001,

  fy: 0,
  fyMax: 100,
  fyMin: -5,
  fyStep: 0.001,

  epsilon: 70,
  epsilonMax: 400,

  mu: 0.0006,
  muMin: 0,
  muMax: 1,
  muStep: 0.0001,

}

let buffer3D;
let shaderBuffer;
let bust;

let meltedFace;

let canvas;
let tex;

// Playing with shaders!
let myShader; 

let x0;
let a, b;
let v;
let f;

function preload() {
  myShader = loadShader('data/sketch.vert', 'data/sketch.frag');
  bust = loadImage('data/bust.png')
}

function setup() {
  createParamGui(s, paramChanged);
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  // shaderBuffer = createGraphics(470*4, 531*4, WEBGL);
  // need to set the "renderer" to WEBGL
  // buffer3D = createGraphics(470*4, 531*4, WEBGL);

  meltedFace = createGraphics(bust.width/2, bust.height/2 + 1000, WEBGL);
  // Workaround for bug: https://github.com/processing/p5.js/issues/5634
  // Enables 3D graphics buffers to have transparent background.
  meltedFace.setAttributes("alpha", true);

  bust.loadPixels();


  x0 = new Vec2(bust.width/2, bust.height);
  f = new Vec2(s.fx, s.fy);
  // epsilon = 70;
  // mu = 	0.0006;
  v = 0.5;
  a = 1 / (4 * PI * s.mu);
  b = a / (4 * (1 - v));

  this.t = 0;

  // buffer3D.setAttributes("alpha", true);
  // shaderBuffer.setAttributes("alpha", true);

  // calcBuffer3D();

  noCursor();
}

function getKelvinlet(r) {
  let r_len = r.length2();
  let r_e = sqrt(r_len*r_len + s.epsilon*s.epsilon);
  let r_e_3 = r_e * r_e * r_e;

  let term1 = (a - b) / r_e;
  let term2 = b / (r_e_3);
  let term3 = (a / 2) * ((s.epsilon*s.epsilon)/r_e_3);

  let rrt = [r.scalarmult(r.getX()), r.scalarmult(r.getY())];

  rrt[0] = rrt[0].scalarmult(term2);
  rrt[1] = rrt[1].scalarmult(term2);

  rrt[0].setX(rrt[0].getX() + term1 + term3);
  rrt[1].setY(rrt[1].getY() + term1 + term3);

  // print(rrt[0], rrt[1])

  let final = new Vec2(rrt[0].dot(f), rrt[1].dot(f));

  // print(f)

  return final;
}

function setMeltedFace() {
  // bust.loadPixels();
  // meltedFace.loadPixels();
  // meltedFace.clear();
  // meltedFace = createGraphics(bust.width/2, bust.height/2 + 5000, WEBGL);

  for (let i = 0; i < meltedFace.pixels.length; i += 4) {

    // print(i, final_i)
      // Red.
      meltedFace.pixels[i] = 0;
      // Green.
      meltedFace.pixels[i + 1] = 0;
      // Blue.
      meltedFace.pixels[i + 2] = 0;
      // Alpha.
      meltedFace.pixels[i + 3] = 0;
      // print(newLoc)

  }
  
  // print(bust.width, bust.height)
  for (let i = 0; i < bust.pixels.length; i += 4) {

    // get new location
    let curLoc = new Vec2((i/4) % bust.width, floor((i/4) / bust.width));
    // print(i, curLoc)
    let r = curLoc.subtract(x0);

    let d = getKelvinlet(r);

    d.setX(floor(d.getX()))
    d.setY(floor(d.getY()))


    // print(d)

    let newLoc = curLoc.add(d);

    // print(newLoc)

    let final_i = int((d.getX() + d.getY() * bust.width))*4;
    final_i += i;

    // print(i, final_i)
    if (newLoc.getX() >= 0 && newLoc.getX() < bust.width && newLoc.getY() >= 0 && newLoc.getY() < meltedFace.height) {

      // Red.
      meltedFace.pixels[final_i] = bust.pixels[i];
      // Green.
      meltedFace.pixels[final_i + 1] = bust.pixels[i+1];
      // Blue.
      meltedFace.pixels[final_i + 2] = bust.pixels[i+2];
      // Alpha.
      meltedFace.pixels[final_i + 3] = bust.pixels[i+3];
      // print(newLoc)

    } else {
      // print(newLoc)
    }
  }
  // meltedFace.background(0, 0)
  meltedFace.fill(100);
  meltedFace.ellipse(0, 0, 100, 100)
  // meltedFace.setInterpolation(NEAREST, NEAREST);
  meltedFace.updatePixels();
  // meltedFace.background(0, 0)
}

// function calcBuffer3D() {
//   // IMPORTANT!: Needed in order to clear depth buffer
//   buffer3D.clear();
//   buffer3D.background(100);
//   // Note: Can draw a background here with buffer3D.background(...)
//   //    if transparency is not desired.

//   // Need push() and pop() here because transformations don't get
//   //   reset each frame.
//   buffer3D.push();
//   // (0,0,0) is at the centre of the canvas
//   // buffer3D.translate(0, cos(r)*(100/factor), 0);
//   // buffer3D.rotateY(r);
//   // buffer3D.rotateX(r);
//   // buffer3D.rotateZ(-r);
//   // buffer3D.texture(textureBuffer);
//   // buffer3D.normalMaterial();
//   // buffer3D.strokeWeight(3);
//   // draw a 100 by 100 by 100 3D cube
//   buffer3D.scale(2)
//   buffer3D.image(bust, 0, 0);
//   buffer3D.pop();

//   // r += 0.01;
// }

// function calcShaderBuffer() {
//   shaderBuffer.shader(myShader);
//   myShader.setUniform('tex0', buffer3D);
//   // print(buffer3D.width, buffer3D.height)
//   myShader.setUniform('texSize', [buffer3D.width, buffer3D.height]);
//   shaderBuffer.push();
//   shaderBuffer.rect(0, 0, shaderBuffer.width, shaderBuffer.height);
//   shaderBuffer.pop();
// }

function mousePressed() {
  print("hfewuoo")
  meltedFace.clear();
}

function draw() {
  // Draw background image to demonstrate p5.Graphics transparency
  // image(bgImg, 0, 0);
  background(255);

  this.t += 0.1;

  f = new Vec2(0, 60*s.fy);

  setMeltedFace();
  // print(meltedFace)
  image(meltedFace, -300, -300)

  // storeTexture();
  // calcBuffer3D();
  // calcShaderBuffer();

  // Draw the 3D buffer based on textureBuffer and buffer3D
  // upsample buffer3D to window size
  // newimg = NearestNeighbour(buffer3D, 4);
  // image(buffer3D, 0, 0);
  // drawOverlay();

  // image(shaderBuffer, -windowWidth/2, -windowHeight/2, shaderBuffer.width/4, shaderBuffer.height/4);
  // canvas.getTexture(shaderBuffer).setInterpolation(NEAREST, NEAREST);
}

function paramChanged(name) {

}


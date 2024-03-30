/*
 * mixed modes demo
 *   Mix of WEBGL 3D and normal 2D p5 rendering modes.
 */

let buffer3D;
let shaderBuffer;
let bust;

let canvas;
let tex;

// Playing with shaders!
let myShader; 

function preload() {
  myShader = loadShader('data/sketch.vert', 'data/sketch.frag');
  bust = loadImage('data/bust.png')
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  shaderBuffer = createGraphics(470*4, 531*4, WEBGL);
  // need to set the "renderer" to WEBGL
  buffer3D = createGraphics(470*4, 531*4, WEBGL);
  // Workaround for bug: https://github.com/processing/p5.js/issues/5634
  // Enables 3D graphics buffers to have transparent background.
  buffer3D.setAttributes("alpha", true);
  shaderBuffer.setAttributes("alpha", true);

  calcBuffer3D();

  noCursor();
}

function calcBuffer3D() {
  // IMPORTANT!: Needed in order to clear depth buffer
  buffer3D.clear();
  buffer3D.background(100);
  // Note: Can draw a background here with buffer3D.background(...)
  //    if transparency is not desired.

  // Need push() and pop() here because transformations don't get
  //   reset each frame.
  buffer3D.push();
  // (0,0,0) is at the centre of the canvas
  // buffer3D.translate(0, cos(r)*(100/factor), 0);
  // buffer3D.rotateY(r);
  // buffer3D.rotateX(r);
  // buffer3D.rotateZ(-r);
  // buffer3D.texture(textureBuffer);
  // buffer3D.normalMaterial();
  // buffer3D.strokeWeight(3);
  // draw a 100 by 100 by 100 3D cube
  // buffer3D.scale(0.8)
  buffer3D.image(bust, 0, 0);
  buffer3D.pop();

  // r += 0.01;
}

function calcShaderBuffer() {
  shaderBuffer.shader(myShader);
  myShader.setUniform('tex0', buffer3D);
  // print(buffer3D.width, buffer3D.height)
  myShader.setUniform('texSize', [buffer3D.width, buffer3D.height]);
  shaderBuffer.push();
  shaderBuffer.rect(0, 0, shaderBuffer.width, shaderBuffer.height);
  shaderBuffer.pop();
}

function draw() {
  // Draw background image to demonstrate p5.Graphics transparency
  // image(bgImg, 0, 0);
  background(255);

  // storeTexture();
  // calcBuffer3D();
  calcShaderBuffer();

  // Draw the 3D buffer based on textureBuffer and buffer3D
  // upsample buffer3D to window size
  // newimg = NearestNeighbour(buffer3D, 4);
  // image(buffer3D, 0, 0);
  // drawOverlay();

  image(shaderBuffer, -windowWidth/2, -windowHeight/2, shaderBuffer.width/4, shaderBuffer.height/4);
  canvas.getTexture(shaderBuffer).setInterpolation(NEAREST, NEAREST);
}


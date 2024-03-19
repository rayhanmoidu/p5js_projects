/*
 * point lights demo
 *   Showcases the effects of point light parameters.
 */


let mode = 0;
let matMode = 0;

// Rotation coordinates
let rX = 0;
let rY = 0;

// Lighting coordinates
let lX = 0;
let lY = 0;

// Shininess amount
let sX = 0;


function setup() {
  // need to set the "renderer" to WEBGL
  createCanvas(300, 300, WEBGL);
}

function draw() {
  background(0);

  // Apply effect of different modes
  if (mode == 0) {
    rX = mouseX - width/2;
    rY = mouseY - height/2;
  }

  if (mode == 1) {
    lX = mouseX - width/2;
    lY = mouseY - height/2;
  }

  if (mode == 2) {
    sX = mouseX - width/2;
  }

  // Configure lighting
  ambientLight(128,128,128);
  specularColor(200,200,200);
  pointLight(255,255,255, lX, lY, 100);

  // Draw shape
  //specularMaterial(128);

  noStroke();
  shininess(map(sX, 0, width, 1, 30));
  push();
  translate(0, 0, -100);
  rotateY(map(rX, 0, width, 0, 2*PI));
  rotateX(map(rY, 0, height, 0, 2*PI));

  if (matMode == 1) {
    specularMaterial(128);
  } else {
    fill(128);
  }

  torus(50, 20);
  pop();

  // Draw circle where light is
  fill(255,255,0);
  ellipse(lX, lY, 10, 10);
}

function keyPressed() {
  switch (key) {
    case 'r': mode = 0; break;
    case 'l': mode = 1; break;
    case 's': mode = 2; break;
    case 'm': matMode = (matMode + 1) % 2; break;
    default: break;
  }
}

let world_outside;

function preload() {
}

function setup() {
  createCanvas(960, 540);
  createParamGui(s, paramChanged);
  
  world_outside = new World_Outside(width, height);
}

function draw() {
  background(16, 12, 47);
  world_outside.update();
  world_outside.draw();
}

function mousePressed() {}

function windowResized() {}

function paramChanged(name) {
  if (name == "w" || name == "h") {
    resizeCanvas(s.w, s.h)
    world_outside = new World_Outside(s.w, s.h);
  }
}
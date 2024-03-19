let cloth;
let simulation;
let timestep = 0.05;

function setup() {
  // need to set the "renderer" to WEBGL
  createCanvas(700, 700);

  cloth = new Cloth();
  simulation = new Simulation(timestep, cloth);
}

function draw() {
  background(0);

  simulation.update();
  cloth.draw();
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

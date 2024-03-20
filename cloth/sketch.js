let cloth;
let simulation;
let timestep = 0.5;

function setup() {
  // need to set the "renderer" to WEBGL
  createCanvas(700, 700, WEBGL);
  

  cloth = new Cloth();
  simulation = new Simulation(timestep, cloth);
}

function draw() {
  background(0);

  simulation.update();
  cloth.draw();
}

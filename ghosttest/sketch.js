let ghosts;
let ghostImg;
let ghostImg_png;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createParamGui(p, paramChanged);

  ghostImg = loadImage('data/ghost.svg');
  ghostImg_png = loadImage('data/ghost.png');
  ghostImg_png.loadPixels();
  // print(ghostImg_png)

  createGhosts();

}

function draw() {
  background(16,12,47);
  for (g of ghosts) {
    g.update();
    g.draw();
  }
  drawFps();
}

function createGhosts() {
  ghosts = [];
  for (let i = 0; i < p.numAgents; i++) {
    let newGhost = new Ghost(i, new Vec3(random(0, width), random(0, height), random(0, p.zDepth)), random(50, 150), ghostImg);
    ghosts.push(newGhost);
  }
  
}

function paramChanged(name) {
  // if (name == "tileSize" || name == "fillScreen") {
  //   createGhosts();
  // }

  if (name == "numAgents") {
    createGhosts();
  }

  // if (name == "color") {
  //   createGhosts();
  // }
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
canvasw = 1100;
canvash = 700;

layerId = 0;
distFromLastLayer = 0;
visibleLayers = [];

treeCycle_pos = 0; // [0, 1] value for interpolating between randomized tree parameters
randomFactory_tree = 0;

// create evenly spaced layers within cube of visible depth
function createStartingLayers() {
  let pos = 0;
  while (pos < p.cubeDepth) {
    addLayer(pos)
    pos += p.layerDistance;
  }
}

// creates a layer at specific depth
function addLayer(depth) {
  let height = round(random(p.hillHeight_min, p.hillHeight_max));

  // interpolate tree parameters based on [0, 1] position in cycle
  treeCycle_pos = min(1, treeCycle_pos + s.treeCycleSpeed);
  let treeParams = randomFactory_tree.getParams_tree(treeCycle_pos);

  visibleLayers.push(new Layer(height, depth, treeParams));
  if (treeCycle_pos >= 1) {
    treeCycle_pos = 0;
  }
}

function preload() {
}

function setup() {
  canvasw = windowWidth;
  canvash = windowHeight;

  createCanvas(canvasw, canvash);
  createParamGui(s, paramChanged);

  randomFactory_tree = new RandomFactory("tree"); // generates randomized tree params
  createStartingLayers();
}

function draw() {
  noCursor();
  background(255, 235, 255);

  distFromLastLayer += s.speed;

  // render all layers within cube of visible depth
  for (let i = visibleLayers.length-1; i >=0; i--) {
      visibleLayers[i].update();
      visibleLayers[i].render();
  }

  // create layer at max depth when threshold is passed
  if (distFromLastLayer > p.layerDistance) {
    addLayer(p.cubeDepth);
    distFromLastLayer = 0;
  }
}

function paramChanged() {};
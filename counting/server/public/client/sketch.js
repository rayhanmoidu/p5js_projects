curValue = 0;
isGameOn = true;
const socket = io();
let woeisme;

function preload() {
  woeisme = loadImage("./woeisme.png")
}

function setup() {
  createCanvas(800, 800);

  // set colour for your frame
  select("body").style("background: #000000;");

  socket.on("increment2", (newVal) => {
    curValue = newVal;
  });

  socket.on("gameover", () => {
    isGameOn = false;
  });

  socket.on("restart2", () => {
    isGameOn = true;
    curValue = 0;
  })
}

function draw() {
  background(0);

  if (isGameOn) {
    fill(255);
    textSize(100);
    textAlign(CENTER, CENTER);
    text(curValue, width/2, height/2);
  } else {
    // woeisme.position(1512/2 - 110, 824/2-103)
    // image(woeisme, width/2 - 110, height/2 - 103);
    push();
    imageMode(CENTER)
    translate(width/2, height/2);
    scale(0.5)
    image(woeisme, 0, 0);
    pop();
  }

}

// function keyPressed() {
//   if (key == " ") {
//     if (isGameOn) {
//       socket.emit("increment", curValue+1);
//     } else {
//       socket.emit("restart");
//     }
//   }
// }

function mousePressed() {
  if (isGameOn) {
    print("hello")
    socket.emit("increment", curValue+1);
  } else {
    socket.emit("restart");
  }
}

// global callback from the settings GUI
function paramChanged(name) {}

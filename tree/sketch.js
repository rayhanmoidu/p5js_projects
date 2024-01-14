// var song;
// let amplitude;
// let audiocontext;

// let numFreqs = 64;

// function preload() {
//   song = loadSound('assets/clairedelune.mp3');
// }

// var prevSpectrum = null;

// function setup() {
//   createCanvas(400, 400);
// }

// const median = arr => {
//   const mid = Math.floor(arr.length / 2),
//     nums = [...arr].sort((a, b) => a - b);
//   return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
// };

// var prevAmplitude = 0;
// var noteCount = 0;
// var isIncreasing = false;

// function draw() {
//   background(100);
//   fill(200);
//   if (song.isPlaying()) {
//     text(noteCount, 20, 20)

//     // prevAmplitude needs to be a decaying over time value of the previous beat
//     if (amplitude.getLevel() > prevAmplitude*1.09 && !isIncreasing) {
//       isIncreasing = true
//       noteCount ++;
//       //circle(random(0, 400), random(0, 400), 20);
//     } else if (amplitude.getLevel() < prevAmplitude) {
//       isIncreasing = false;
//     }
//     prevAmplitude = amplitude.getLevel()
    


//     circle(200, 200, amplitude.getLevel()*300)

    
  

//     let spectrum = fft.analyze(numFreqs);
//     noStroke();
//     fill(255, 0, 255);
//     let avg = 0
//     let count = 0
//     //lala = spectrum.sort((a, b) => a - b)
//     for (let i = 0; i < spectrum.length; i++){
//       if (spectrum[i] > 0) {
//         avg += spectrum[i];
//         count ++
//       }
//     }
//     avg /= count
//     count = 0
//     mymed = median(spectrum.filter((val) => val > 0))
//     //avg = lala[lala.length / 2]

//     // TAKE DIFFS FROM PREVIOUS FFT RESULT AND USE THAT TO COMPUTE NEW FORCE VECTOR
    
//     for (let i = 0; i < numFreqs; i++){
//       if (spectrum[i] > mymed) {
//         count ++
      
//       newheight = spectrum[i];
//       if (prevSpectrum) {
//         newheight -= max(0, prevSpectrum[i]);
//       }
//       let x = map(i, 0, numFreqs, 0, 400);
//       let h = -400 + map(newheight, 0, 255, 400, 0);
//       rect(x, 400, width / numFreqs, h)
//       }
      
//     }
//     print(count)
//     prevSpectrum = spectrum;
//   }
// }

// function mousePressed() {
//   audiocontext = getAudioContext();
//   song.play();
//   amplitude = new p5.Amplitude();
//   amplitude.setInput(song);
//   fft = new p5.FFT();
// }




// ************************************* NEW *************************************

var tree;
var simulation;
var hasStarted = false;

function setup() {
  createCanvas(1500, 800);
  tree = new Tree("basicFractal");
  simulation = new Simulation(tree.getSprings(), tree.getParticles(), 0.5);
  
}

function draw() {
  background(100);
  fill(200);

  if (hasStarted) {
    randomval = random(0, 2);
    simulation.addExternalForce(new Vec2((randomval-1)*500, 0));
    simulation.update();
    simulation.resetExternalForces();
  }

  springs = simulation.getSprings();
  for (let i = 0; i < springs.length; i++) {
    endpoints = springs[i].getEndpoints();
    line(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), endpoints[1].getPos().getX(), endpoints[1].getPos().getY())
    circle(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), 3);
    circle(endpoints[1].getPos().getX(), endpoints[1].getPos().getY(), 3);
  }
}

function mousePressed() {
  if (!hasStarted) {
    hasStarted = true;
  }
}



 

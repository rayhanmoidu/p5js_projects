// var song;
// let amplitude;
// let audiocontext;
// function preload() {
//   song = loadSound('assets/clairedelune.mp3');
// }

// var prevSpectrum = null;

// function setup() {
//   createCanvas(400, 400);
// }

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

// var song;
// let amplitude;
// let audiocontext;

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
let numFreqs = 64;

var tree;
var simulation;
var hasStarted = false;
var shouldAddExternalForce = false;

var song;
let amplitude;
let audiocontext;

var prevAmplitude = 0;
var noteCount = 0;
var isIncreasing = false;

function preload() {
  song = loadSound('assets/clairedelune.mp3');
}

function setup() {
  createCanvas(1500, 800);

  // basic = new Tree("starting");
  // simulation = new Simulation(basic.getSprings(), basic.getParticles(), 0.5);

  tree = new Tree("basicFractal", PI/6, 750, 12, 2, 150, 75, 0.9, 50000, 0.9); // 0.75 for mass
  tree2 = new Tree("basicFractal", PI/6, 200, 4, 2, 100, 50, 0.7, 3000, 0.9);
  simulation = new Simulation(tree.getSprings(), tree.getParticles(), 0.5);
  // simulation = new Simulation(tree.getSprings().concat(tree2.getSprings()), tree.getParticles().concat(tree2.getParticles()), 0.5);
  
}

function compareSprings(a, b) {
  return b.getLevel() - a.getLevel();
}

function draw() {
  background(100);
  fill(200);

  let externalForce = new Vec2(0, 0);

  if (hasStarted) {

    let encounteredNewNote = false;

    let curAmplitude = amplitude.getLevel();
    let spectrum = fft.analyze(numFreqs);

    if (curAmplitude > prevAmplitude*1.09 && !isIncreasing) {
      isIncreasing = true
      encounteredNewNote = true;
      noteCount ++;
    } else if (curAmplitude < prevAmplitude) {
      isIncreasing = false;
    }

    if (encounteredNewNote) {
      let avg = 0
      let count = 0
      for (let i = 0; i < spectrum.length; i++){
        if (spectrum[i] > 0) {
          avg += spectrum[i];
          count ++
        }
      }
      avg /= count
      med = median(spectrum.filter((val) => val > 0))

      freqTotal = 0;
      weightedIndices = 0;
      maxfreq = -1;
      for (let i = 0; i < numFreqs; i++){
        if (spectrum[i] > med) {
          freqTotal += spectrum[i];
          weightedIndices += spectrum[i]*i;
          if (i > maxfreq) {
            maxfreq = i;
          }
        }
      }

      avgFrequencyIndex = weightedIndices / freqTotal;
      percentVal = avgFrequencyIndex / maxfreq;
      print(percentVal)

      if (percentVal > 1) {
        print("BAD BAD BAD!!!");
      }

      let forceTheta = 2*PI * percentVal;

      let forceDir = new Vec2(1, 0);
      let force = forceDir.scalarmult(curAmplitude);

      let directedfx = force.getX()*cos(forceTheta) - force.getY()*sin(forceTheta);
      let directedfy = force.getX()*sin(forceTheta) + force.getY()*cos(forceTheta);

      if (directedfx && directedfy) {
        externalForce = new Vec2(directedfx, directedfy);
      }
    }

    prevAmplitude = curAmplitude
    prevSpectrum = spectrum;
  }

  if (hasStarted) {
    randomval = random(0, 2);
    if (shouldAddExternalForce) {
      simulation.addExternalForce(new Vec2((randomval)*100, 0));
    }
    simulation.addExternalForce(externalForce.scalarmult(5000000));
    simulation.update();
    simulation.resetExternalForces();
  }
  
  springs = simulation.getSprings();
  springs.sort(compareSprings)
  for (let i = 0; i < springs.length; i++) {
    endpoints = springs[i].getEndpoints();
    strokeWeight(springs[i].getLevel());
    stroke((12-springs[i].getLevel())/12 * 50)
    line(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), endpoints[1].getPos().getX(), endpoints[1].getPos().getY())
    // if (springs[i].getLevel()==1) {
    // // circle(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), 2);
    //   fill(83, 130, 65)
    //   stroke(83, 130, 65)
    //   circle(endpoints[1].getPos().getX(), endpoints[1].getPos().getY(), 7.5);
    //   stroke(0)
    // }
  }

  for (let i = 0; i < springs.length; i++) {
    
    // strokeWeight(springs[i].getLevel());
    // stroke((12-springs[i].getLevel())/12 * 50)
    // line(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), endpoints[1].getPos().getX(), endpoints[1].getPos().getY())
    if (springs[i].getLevel()==1) {
      endpoints = springs[i].getEndpoints();
    // circle(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), 2);
      fill(83, 130, 65)
      stroke(83, 130, 65)
      circle(endpoints[1].getPos().getX(), endpoints[1].getPos().getY(), 6);
      stroke(0)
    }
  }

}

function mousePressed() {
  if (!hasStarted) {
    hasStarted = true;
    audiocontext = getAudioContext();
    song.play();
    amplitude = new p5.Amplitude();
    amplitude.setInput(song);
    fft = new p5.FFT();
  } else if (hasStarted) {
    hasStarted = false;
  }
  shouldAddExternalForce = !shouldAddExternalForce;
}



 

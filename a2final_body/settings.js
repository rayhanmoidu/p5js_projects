// parameters
let p = {
    // toggle filling screen or not
    fillScreen: false,
    color: false,

    confidence: 0.5,
    confidenceMin: 0,
    confidenceMax: 1,
    confidenceStep: 0.01,

    zscale: 20,
    zscaleMax: 100,
    zscaleMin: 0.01,
    zscaleStep: 0.01,

    componentOffset: 300,
    componentOffsetMax: 500,

    offsetMult: 1,
    offsetMultMin: 0,
    offsetMultStep: 0.01,
  
    lr: 200,
    lrMax: 1500,
    lrMin: 0,

    lx: 300,
    lxMax: 1500,
    lxMin: 0,

    ly: 300,
    lyMax: 1500,
    lyMin: 0,

    lz: 5,
    lzMax: 1500,
    lzMin: 0,

    zDepth: 600,
    zDepthMax: 2000,
    zDepthMin: 10,

    noiseLevel: 0.5,
    noiseLevelMin: 0,
    noiseLevelMax: 1,
    noiseLevelStep: 0.05,
  
    // tile size
    numAgents: 250,
    numAgentsMin: 1,
    numAgentsMax: 1000,
  
    // fish speed
    speed: 0.5,
    speedMin: 0,
    speedMax: 1,
    speedStep: 0.05,
  
    // shape scale
    shapeScale: 0.5,
    shapeScaleMin: 0.1,
    shapeScaleMax: 3,
    shapeScaleStep: 0.01,
  
    bboxScale: 1,
    bboxScaleMin: 0,
    bboxScaleMax: 100,

    forceMultiplier: 0.1,
    forceMultiplierMax: 10000,
    forceMultiplierMin: 0.01,
    forceMultiplierStep: 0.01,

    ghostFade: 3,
    ghostFadeMax: 10,
  
    ghostZ: 5,

    om1x: -50,
    om1xMax: 500,
    om1xMin: -500,

    om1y: -347,
    om1yMax: 500,
    om1yMin: -500,

    om2y: 9,
    om2yMax: 500,
    om2yMin: -500,

    om2x: -379,
    om2xMax: 500,
    om2xMin: -500,

    om3y: -56,
    om3yMax: 500,
    om3yMin: -500,

    om3x: -42,
    om3xMax: 500,
    om3xMin: -500,

    om4y: -278,
    om4yMax: 500,
    om4yMin: -500,

    om4x: -333,
    om4xMax: 500,
    om4xMin: -500,

    om5y: -407,
    om5yMax: 500,
    om5yMin: -500,

    om5x: -76,
    om5xMax: 500,
    om5xMin: -500,
  };
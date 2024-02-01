// Dynamic Settings
let s = {
    speed: 0.01,
    speedMin: 0.001,
    speedMax: 0.5,
    speedStep: 0.001,
  
    treeCycleSpeed: 0.15,
    treeCycleSpeedMax: 1,
    treeCycleSpeedMin: 0.01,
    treeCycleSpeedStep: 0.01,
};

// Static Settings
let p = {
    // general
    layerDistance: 3,
    cubeDepth: 15,
    windForce: 1000,
    simulationTimestep: 0.25,
    treeRandomnessTolerance: 0.3,

    // springs
    springKs: 15000,
    springKd: 0.05,

    // layer
    hillHeight_min: 100,
    hillHeight_max: 250,
    peakThresholdX: 100,
    characterTolerance_tree: 200,
    characterTolerance_extra: 300,

    // dress
    dressHeight: 200,
    dressWidth: 67,
    dressTolerance: 12,
    dressOffsetFactor: 1/6,
    dressConstraintTolerance: 30,
    dress_frontMass: 15000,
    dress_backMass: 10000,
    dress_topMass: 500,

    // character
    headRadius: 25,
    neckLength: 10,
    legLength: 100,
    legWidth: 10,
    neckWidth: 10,

    // tree
    treeMass: 3000,
    treeMassFactor: 0.8,
    branchingFactor: 2,
    leafRadius: 6,
    returningForceFactor: 300,
    randomForceFactor: 350,

    angleOffset_min: 0.1,
    angleOffset_max: 1.4,
    numLevels_min: 7,
    numLevels_max: 10,
    treeHeight_min: 250,
    treeHeight_max: 400,
    branchLength_min: 50,
    branchLength_max: 150,
    branchLengthFactor_min: 0.8,
    branchLengthFactor_max: 0.9,

    // hair
    hairMass: 250,
    hairMassFactor: 0.8,
    hairMassRandomFactor_lower: 0.7,
    hairMassRandomFactor_upper: 1.3,

    springsPerStrand_min: 5,
    springsPerStrand_max: 10,
    strandLength_min: 125,
    strandLength_max: 250,
    lineWeightDivisions_min: 2,
    lineWeightDivisions_max: 6,
    curveThreshold_min: 15,
    curveThreshold_max: 90,
    numStrands_min: 6,
    numStrands_max: 12,
    rootWidth_max: 6,
}
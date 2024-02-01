class RandomFactory {
    // creates 2 parameter sets: source and destination
    // when queried with t=[0, 1], returns an interpolated blend of the source and destination parameters
    // when queried with t=1, source becomes destination, and a new destination is generated

    constructor(mode) {
        if (mode=="tree") {
            this.initTree();
        }
    }

    initTree() {
        // create source parameter set
        this.angleOffset_1 = random(p.angleOffset_min, p.angleOffset_max);
        this.numLevels_1 = round(random(p.numLevels_min, p.numLevels_max));
        this.treeHeight_1 = random(p.treeHeight_min, p.treeHeight_max);
        this.branchLength_1 = random(p.branchLength_min, p.branchLength_max);
        this.branchLengthFactor_1 = random(p.branchLengthFactor_min, p.branchLengthFactor_max);

        // create destination parameter set
        let newRandomVals = this.getNewRandomParams({
            "angleOffset": this.angleOffset_1,
            "numLevels": this.numLevels_1,
            "treeHeight": this.treeHeight_1,
            "branchLength": this.branchLength_1,
            "branchLengthFactor": this.branchLengthFactor_1,
        })
        this.angleOffset_2 = newRandomVals.angleOffset;
        this.numLevels_2 = newRandomVals.numLevels;
        this.treeHeight_2 = newRandomVals.treeHeight;
        this.branchLength_2 = newRandomVals.branchLength;
        this.branchLengthFactor_2 = newRandomVals.branchLengthFactor;
    }

    getNewRandomParams(randomVals) {
        // creates a new destination paramater set, ensuring new values are beyond a threshold of previous destination
        let tol = p.treeRandomnessTolerance;

        // compute param ranges
        let angleOffset_range = p.angleOffset_max - p.angleOffset_min;
        let numLevels_range = p.numLevels_max - p.numLevels_min;
        let treeHeight_range = p.treeHeight_max - p.treeHeight_min;
        let branchLength_range = p.branchLength_max - p.branchLength_min;
        let branchLengthFactor_range = p.branchLengthFactor_max - p.branchLengthFactor_min;

        // generate randomized destination parameters, respecting threshold
        let angleOffset = randomVals.angleOffset;
        while (angleOffset >= randomVals.angleOffset-(angleOffset_range*tol) && angleOffset <= randomVals.angleOffset+(angleOffset_range*tol)) {
            angleOffset = random(p.angleOffset_min, p.angleOffset_max);
        }

        let numLevels = randomVals.numLevels;
        while (numLevels >= randomVals.numLevels-(numLevels_range*tol) && numLevels <= randomVals.numLevels+(numLevels_range*tol)) {
            numLevels = round(random(p.numLevels_min, p.numLevels_max));
        }

        let treeHeight = randomVals.treeHeight;
        while (treeHeight >= randomVals.treeHeight-(treeHeight_range*tol) && treeHeight <= randomVals.treeHeight+(treeHeight_range*tol)) {
            treeHeight = random(p.treeHeight_min, p.treeHeight_max);
        }

        let branchLength = randomVals.branchLength;
        while (branchLength >= randomVals.branchLength-(branchLength_range*tol) && branchLength <= randomVals.branchLength+(branchLength_range*tol)) {
            branchLength = random(p.branchLength_min, p.branchLength_max);
        }

        let branchLengthFactor = randomVals.branchLengthFactor;
        while (branchLengthFactor >= randomVals.branchLengthFactor-(branchLengthFactor_range*tol) && branchLengthFactor <= randomVals.branchLengthFactor+(branchLengthFactor_range*tol)) {
            branchLengthFactor = random(p.branchLengthFactor_min, p.branchLengthFactor_max);
        }

        // return destination values
        return {
            "angleOffset": angleOffset,
            "numLevels": numLevels,
            "treeHeight": treeHeight,
            "branchLength": branchLength,
            "branchLengthFactor": branchLengthFactor,
        }
    }

    getParams(t) {
        // interpolates source and destination param sets based on t=[0, 1]
        let retVal = {
            "angleOffset": (1-t)*this.angleOffset_1 + t*this.angleOffset_2,
            "numLevels": round((1-t)*this.numLevels_1 + t*this.numLevels_2),
            "treeHeight": (1-t)*this.treeHeight_1 + t*this.treeHeight_2,
            "branchLength": (1-t)*this.branchLength_1 + t*this.branchLength_2,
            "branchLengthFactor": (1-t)*this.branchLengthFactor_1 + t*this.branchLengthFactor_2,
        }

        if (t == 1) {
            // set source to curDestination
            this.angleOffset_1 = this.angleOffset_2;
            this.numLevels_1 = this.numLevels_2;
            this.treeHeight_1 = this.treeHeight_2;
            this.branchLength_1 = this.branchLength_2;
            this.branchLengthFactor_1 = this.branchLengthFactor_2;

            // generate new destination set
            let newRandomVals = this.getNewRandomParams({
                "angleOffset": this.angleOffset_1,
                "numLevels": this.numLevels_1,
                "treeHeight": this.treeHeight_1,
                "branchLength": this.branchLength_1,
                "branchLengthFactor": this.branchLengthFactor_1,
            })
            this.angleOffset_2 = newRandomVals.angleOffset;
            this.numLevels_2 = newRandomVals.numLevels;
            this.treeHeight_2 = newRandomVals.treeHeight;
            this.branchLength_2 = newRandomVals.branchLength;
            this.branchLengthFactor_2 = newRandomVals.branchLengthFactor;
        }

        return retVal;
    }
}
class RandomFactory {
    constructor(mode) {
        if (mode=="tree") {
            this.initTree();
        }
    }

    initTree() {
        this.angleOffset_1 = random(0.1, 1.4);
        this.numLevels_1 = round(random(7, 10));
        this.treeHeight_1 = random(250, 400);
        this.branchLength_1 = random(50, 150);
        this.branchLengthFactor_1 = random(0.8, 0.9);

        let newRandomVals = this.getNewRandomVals({
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

    getNewRandomVals(randomVals) {
        let tol = 0.3;
        let angleOffset = randomVals.angleOffset;
        while (angleOffset >= randomVals.angleOffset-(1.3*tol) && angleOffset <= randomVals.angleOffset+(1.3*tol)) {
            angleOffset = random(0.1, 1.4);
        }

        let numLevels = randomVals.numLevels;
        while (numLevels >= randomVals.numLevels-(3*tol) && numLevels <= randomVals.numLevels+(3*tol)) {
            numLevels = round(random(7, 10));
        }

        let treeHeight = randomVals.treeHeight;
        while (treeHeight >= randomVals.treeHeight-(150*tol) && treeHeight <= randomVals.treeHeight+(150*tol)) {
            treeHeight = random(250, 400);
        }

        let branchLength = randomVals.branchLength;
        while (branchLength >= randomVals.branchLength-(100*tol) && branchLength <= randomVals.branchLength+(100*tol)) {
            branchLength = random(50, 150);
        }

        let branchLengthFactor = randomVals.branchLengthFactor;
        while (branchLengthFactor >= randomVals.branchLengthFactor-(0.1*tol) && branchLengthFactor <= randomVals.branchLengthFactor+(0.1*tol)) {
            branchLengthFactor = random(0.8, 0.9);
        }

        return {
            "angleOffset": angleOffset,
            "numLevels": numLevels,
            "treeHeight": treeHeight,
            "branchLength": branchLength,
            "branchLengthFactor": branchLengthFactor,
        }
    }

    getVals(t) {
        let retVal = {
            "angleOffset": (1-t)*this.angleOffset_1 + t*this.angleOffset_2,
            "numLevels": round((1-t)*this.numLevels_1 + t*this.numLevels_2),
            "treeHeight": (1-t)*this.treeHeight_1 + t*this.treeHeight_2,
            "branchLength": (1-t)*this.branchLength_1 + t*this.branchLength_2,
            "branchLengthFactor": (1-t)*this.branchLengthFactor_1 + t*this.branchLengthFactor_2,
        }

        if (t == 1) {
            this.angleOffset_1 = this.angleOffset_2;
            this.numLevels_1 = this.numLevels_2;
            this.treeHeight_1 = this.treeHeight_2;
            this.branchLength_1 = this.branchLength_2;
            this.branchLengthFactor_1 = this.branchLengthFactor_2;

            let newRandomVals = this.getNewRandomVals({
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
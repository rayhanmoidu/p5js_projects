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

        this.angleOffset_2 = random(0.1, 1.4);
        this.numLevels_2 = round(random(7, 10));
        this.treeHeight_2 = random(250, 400);
        this.branchLength_2 = random(50, 150);
        this.branchLengthFactor_2 = random(0.8, 0.9);
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

            this.angleOffset_2 = random(0.1, 1.4);
            this.numLevels_2 = round(random(7, 10));
            this.treeHeight_2 = random(250, 400);
            this.branchLength_2 = random(50, 150);
            this.branchLengthFactor_2 = random(0.8, 0.9);
        }

        return retVal;
    }
}
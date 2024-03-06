class OmComponents {
    constructor(numComponents) {
        this.numComponents = numComponents;
        this.offsets = [];

        for (let i = 0; i < this.numComponents; i++) {
            let xOffset = random(-p.componentOffset, p.componentOffset);
            let yOffset = random(-p.componentOffset, p.componentOffset);
            let zOffset = random(-p.componentOffset, p.componentOffset);
            this.offsets.push(new Vec3(xOffset, yOffset, zOffset));
        }
    }

    getPositions() {
        let retPos = [];
        for (let i = 0; i < this.numComponents; i++) {
            retPos.push(this.offsets[i].scalarmult(p.offsetMult)); // change to some lighting factor
        }
        return retPos;
    }

    getPosition(i, mult) {
        return this.offsets[i].scalarmult(mult);
    }
};
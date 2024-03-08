class EntityComponents {
    constructor(numComponents) {
        this.numComponents = numComponents;
        this.offsets = [];

        for (let i = 0; i < this.numComponents; i++) {
            let xOffset = random(-p.componentOffset, p.componentOffset);
            let yOffset = random(-p.componentOffset, p.componentOffset);
            let zOffset = random(-5, 5);
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

    getOrbitPos(i, t) {
        let c = this.offsets[i].scalarmult(0.5);
        let shifted_t = ((PI - abs(PI - t)) + 1) / PI;
        return new Vec3((c.getX() - c.getX()*cos(t))*(shifted_t), c.getY()*sin(t)*(shifted_t), c.getZ()*shifted_t);
    }
};
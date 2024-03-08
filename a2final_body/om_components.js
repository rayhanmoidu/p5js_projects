class OmComponents {
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

    getPosition_circle(i, t) {
        let c = this.offsets[i].scalarmult(0.5);
        let z = sqrt(1 - 2*cos(t)*cos(t));
        let lalala = ((PI - abs(PI - t)) + 1) / PI;
        return new Vec3((c.getX() - c.getX()*cos(t))*(lalala), c.getY()*sin(t)*(lalala), c.getZ()*lalala);
    }
};
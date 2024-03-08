class EntityComponents {
    constructor(numComponents) {
        this.numComponents = numComponents;
        this.offsets = [];

        // for each component, generate a 3D offset
        for (let i = 0; i < this.numComponents; i++) {
            let xOffset = random(-p.componentOffset, p.componentOffset);
            let yOffset = random(-p.componentOffset, p.componentOffset);
            let zOffset = random(-5, 5);
            this.offsets.push(new Vec3(xOffset, yOffset, zOffset));
        }
    }

    // returns the position along the orbit for component i, based on parameter t=[0, 2pi]
    getOrbitPos(i, t) {
        let c = this.offsets[i].scalarmult(0.5);
        let shifted_t = ((PI - abs(PI - t)) + 1) / PI;
        return new Vec3((c.getX() - c.getX()*cos(t))*(shifted_t), c.getY()*sin(t)*(shifted_t), c.getZ()*shifted_t);
    }
};
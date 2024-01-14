class SpringEndpoint {

    constructor(id, pos, m) {
        this.id = id;
        this.pos = pos;
        this.inverseM = 1/m;

        this.f = new Vec2(0, 0);
        this.oldpos = pos;
        this.v = new Vec2(0, 0);
        this.isFixed = false;
    }

    fix() {
        this.isFixed = true;
    }

    getPos() {
        return this.pos;
    }

    addForce(f) {
        this.f = this.f.add(f);
    }

    clearForce() {
        this.f = new Vec2(0, 0);
    }

    computeNewPosition_verlet(timeStep) {
        if (!this.isFixed) {
            let newF = this.f.scalarmult(this.inverseM);
            
            let posDiff = this.pos.subtract(this.oldpos);
            let term1 = this.pos.add(posDiff);

            let newpos = newF.scalarmult(timeStep*timeStep).add(term1);
            
            this.oldpos = this.pos;
            this.pos = newpos;
        }
    }

}
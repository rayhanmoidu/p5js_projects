class SpringEndpoint {

    constructor(id, pos, m) {
        this.startpos = pos;
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

    getVelocity() {
        return this.v;
    }

    addReturningForce() {
        let diff = this.startpos.subtract(this.pos);
        let weight = diff.length2();
        this.f = this.f.add(diff.scalarmult(100));
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

            let velocity = this.pos.subtract(this.oldpos).scalarmult(1/timeStep);
            this.v = velocity;
        }
    }

}
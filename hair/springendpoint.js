class SpringEndpoint {

    constructor(id, pos, m, level) {
        this.startpos = pos;
        this.id = id;
        this.pos = pos;
        this.inverseM = 1/(m*level);

        this.f = new Vec2(0, 0);
        this.oldpos = pos;
        this.v = new Vec2(0, 0);
        this.isFixed = false;
        this.level = level;
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
        this.f = this.f.add(diff.scalarmult(500));
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

            // let weight = (this.level) / 12
            // weight *= weight;
            // this.pos = newpos.scalarmult(1-weight).add(this.pos.scalarmult(weight));
            this.pos = newpos;

            let velocity = this.pos.subtract(this.oldpos).scalarmult(1/timeStep);
            this.v = velocity;
        }
    }

}
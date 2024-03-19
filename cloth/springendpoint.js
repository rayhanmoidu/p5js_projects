class SpringEndpoint {
    constructor(id, pos, m) {
        this.id = id;

        this.pos = pos;
        this.oldpos = pos;

        this.m = m;
        this.inverseM = 1/m;

        this.f = new Vec3(0, 0, 0);
        this.v = new Vec3(0, 0, 0);

        this.isFixed = false;
    }

    fix() {
        this.isFixed = true;
    }

    computeNewPosition(timestep) {
        if (!this.isFixed) {
            let newF = this.f.scalarmult(this.inverseM);
            
            let posDiff = this.pos.subtract(this.oldpos);
            let term1 = this.pos.add(posDiff);

            let newpos = newF.scalarmult(timestep*timestep).add(term1);
            
            // adjust pos and oldpos, respecting constraints
            this.oldpos = this.pos;
            this.pos = newpos;

            // set velocity
            let velocity = this.pos.subtract(this.oldpos).scalarmult(1/timestep);
            this.v = velocity;
        }
    }

    updatePos(newpos) {
        if (!this.isFixed) {
            this.oldpos = this.pos;
            this.pos = newpos;
        }
    }

    addForce(f) {
        this.f = this.f.add(f);
    }

    resetForces() {
        this.f = new Vec3(0, 0, 0);
    }

    // getters / setters

    getID() {
        return this.id;
    }

    getPos() {
        return this.pos;
    }

    getOldPos() {
        return this.oldpos;
    }

    getMass() {
        return this.mass;
    }

    getIsFixed() {
        return this.isFixed;
    }

    getVelocity() {
        return this.v;
    }
}
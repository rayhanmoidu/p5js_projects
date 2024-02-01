class SpringEndpoint {
    constructor(id, type, pos, m, level) {
        this.id = id;
        this.type = type;
        this.level = level;

        // mass
        this.m = m * level;
        this.inverseM = 1/this.m;

        // position
        this.startpos = pos;
        this.pos = pos;
        this.oldpos = pos;

        // current force influencing particle
        this.f = new Vec2(0, 0);
        // current velocity of particle
        this.v = new Vec2(0, 0);

        // fixed particles do not undergo motion
        this.isFixed = false;
    }

    // sets a constraint along x-axis that particle should respect
    setXConstraint(x, isGreaterThan) {
        this.xConstraint = x;
        this.isGreaterThan = isGreaterThan;
    }

    addTreeForce(z) {
        // tree particles undergo special forces
        if (this.type=="tree") {
            // add force to return particle to starting poisition
            let diff = this.startpos.subtract(this.pos);
            this.f = this.f.add(diff.scalarmult(p.returningForceFactor*z));

            // add large force in randomized direction
            this.f = this.f.add(new Vec2(p.randomForceFactor*random(-5, 5), p.randomForceFactor*random(0, 10)))
        }
    }

    addForce(force) {
        this.f = this.f.add(force);
    }

    clearForce() {
        this.f = new Vec2(0, 0);
    }

    // returns adjustment factor to a computed newpos, such that constraint is respected 
    getConstraintSatisfier(newpos) {
        if (this.xConstraint) {
            if (this.isGreaterThan && newpos.getX() > this.xConstraint) {
                return new Vec2(this.xConstraint - newpos.getX(), 0);
            }
            if (!this.isGreaterThan && newpos.getX() < this.xConstraint) {
                return new Vec2(this.xConstraint - newpos.getX(), 0);
            }
        }
        return new Vec2(0, 0)
    }

    computeNewPosition(timeStep) {
        if (!this.isFixed) {
            // compute new position using Verlet integration
            let newF = this.f.scalarmult(this.inverseM);
            
            let posDiff = this.pos.subtract(this.oldpos);
            let term1 = this.pos.add(posDiff);

            let newpos = newF.scalarmult(timeStep*timeStep).add(term1);
            
            // adjust pos and oldpos, respecting constraints
            this.oldpos = this.pos.add(this.getConstraintSatisfier(newpos));
            this.pos = newpos.add(this.getConstraintSatisfier(newpos));

            // set velocity
            let velocity = this.pos.subtract(this.oldpos).scalarmult(1/timeStep);
            this.v = velocity;
        }
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
}
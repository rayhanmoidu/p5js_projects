springTypes_gravity = ["hair"]

class SpringEndpoint {

    constructor(id, type, pos, m, level) {
        this.type = type;
        this.startpos = pos;
        this.id = id;
        this.pos = pos;
        if (type=="tree" || type=="hair") {
            this.m = m * level;
        } else {
            this.m = m;
        }
        this.inverseM = 1/this.m;

        this.f = new Vec2(0, 0);
        this.oldpos = pos;
        this.v = new Vec2(0, 0);
        this.isFixed = false;
        this.level = level;
    }

    setXConstraint(x, isGreaterThan) {
        this.xConstraint = x;
        this.isGreaterThan = isGreaterThan;
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
        if (this.type=="tree") {
            let diff = this.startpos.subtract(this.pos);
            let weight = diff.length2();
            this.f = this.f.add(diff.scalarmult(500));
        }
    }

    addForce(force) {
        this.f = this.f.add(force);
        // print(force)
        // if (force.key == "wind") {
        //     this.f = this.f.add(force.f);
        // } else if (force.key == "spring") {
        //     print(force.f)
        //     this.f = this.f.add(force.f);
        // } else if (force.key == "gravity" && springTypes_gravity.includes(this.type)) {
        //     this.f = this.f.add(force.f.scalarmult(this.m));
        // }
    }

    clearForce() {
        this.f = new Vec2(0, 0);
    }

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

    computeNewPosition_verlet(timeStep) {
        if (!this.isFixed) {
            let newF = this.f.scalarmult(this.inverseM);
            if (this.type=="hair") {
                print(newF, this.f, this.m, this.inverseM)
            }
            
            let posDiff = this.pos.subtract(this.oldpos);
            let term1 = this.pos.add(posDiff);

            let newpos = newF.scalarmult(timeStep*timeStep).add(term1);
            
            this.oldpos = this.pos.add(this.getConstraintSatisfier(newpos));
            this.pos = newpos.add(this.getConstraintSatisfier(newpos));
            // if (this.id==0) {
            //     print(this.oldpos, this.pos)
            // }
            // let weight = (this.level) / 12
            // weight *= weight;
            // this.pos = newpos.scalarmult(1-weight).add(this.pos.scalarmult(weight));

            let velocity = this.pos.subtract(this.oldpos).scalarmult(1/timeStep);
            this.v = velocity;
        }
    }

}
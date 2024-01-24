class Particle {
    constructor(pos, m) {
        this.pos = pos;
        this.inverseM = 1/(m);
        this.v = new Vec2(0, 0);
        this.oldpos = pos;
        this.f = new Vec2(0, 9.81*m);
        this.posDiff = new Vec2(0, 0);
    }

    getX() {
        return this.pos.getX();
    }

    getY() {
        return this.pos.getY();
    }

    getPos() {
        return this.pos;
    }

    getV() {
        return this.v
    }

    adjustPrevPos(theta) {
        let diff = this.oldpos.subtract(this.pos);
        let dx = diff.getX()*cos(theta) - diff.getY()*sin(theta);
        let dy = diff.getY()*cos(theta) + diff.getX()*sin(theta);
        this.oldpos = this.pos.add(new Vec2(dx, dy));
    }

    computeNewPosition_bounce(timeStep) {
        let newF = this.f.scalarmult(this.inverseM);
        
        let posDiff = this.pos.subtract(this.oldpos);
        this.posDiff = posDiff;
        let term1 = this.pos.add(posDiff);

        let newpos = newF.scalarmult(timeStep*timeStep).add(term1);
        
        this.oldpos = this.pos.add(posDiff.scalarmult(2));
        this.pos = newpos;

        let velocity = this.pos.subtract(this.oldpos).scalarmult(1/timeStep);
        this.v = velocity;
    }

    computeNewPosition(timeStep) {
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
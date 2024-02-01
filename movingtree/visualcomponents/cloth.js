class Cloth {
    // dress is modelled as a triangle of springs

    constructor(startPos, dressHeight, dressWidth, dressOffsetDir, dressOffset) {
        // springs and particles defining triangle
        this.springs = [];
        this.particles = [];
        // IDs of particles that do not undergo motion
        this.fixedIds = [];

        this.setupCloth(startPos, dressHeight, dressWidth, dressOffsetDir, dressOffset);

        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    setupCloth(startPos, dressHeight, dressWidth, dressOffsetDir, dressOffset) {
        // upper particle (connected to neck)
        let se1 = new SpringEndpoint(0, "cloth", new Vec2(startPos.getX(), startPos.getY()), p.dress_topMass, 1);

        // create lower particles (forming the dress triangle), offset to make non-isosceles
        let se1_adder = dressOffsetDir == -1 ? dressOffset : 0;
        let se2_adder = dressOffsetDir == 1 ? dressOffset : 0;
        let se1_m = dressOffsetDir == -1 ? p.dress_frontMass : p.dress_backMass;
        let se2_m = dressOffsetDir == 1 ? p.dress_frontMass : p.dress_backMass;
        let se2 = new SpringEndpoint(1, "cloth", new Vec2(startPos.getX() - dressWidth, startPos.getY() + dressHeight + se1_adder), se1_m, 1);
        let se3 = new SpringEndpoint(2, "cloth", new Vec2(startPos.getX() + dressWidth, startPos.getY() + dressHeight + se2_adder), se2_m, 1);

        // set constraints on lower particles to prevent penetration of "character body"
        se2.setXConstraint(startPos.getX() - p.dressConstraintTolerance, true);
        se3.setXConstraint(startPos.getX() + p.dressConstraintTolerance, false);

        // create spring objects
        let r12 = se1.getPos().subtract(se2.getPos()).length2();
        let r13 = se1.getPos().subtract(se3.getPos()).length2();
        let r23 = se2.getPos().subtract(se3.getPos()).length2();
        let s12 = new Spring(0, se1, se2, r12, p.springKs, p.springKd, 1);
        let s13 = new Spring(1, se1, se3, r13, p.springKs, p.springKd, 1);
        let s23 = new Spring(2, se2, se3, r23, p.springKs, p.springKd, 1);

        this.springs = [s12, s13, s23];
        this.particles = [se1, se2, se3];
        this.fixedIds = [0]; // upper particle is fixed
    }

    render() {
        push();
        
        noStroke();
        fill(240, 234, 214);

        let startPos = this.particles[0].getPos();

        // for visualization, push midpoints of triangle side-lengths inwards, to create curved effect 
        // midpoint 1
        let vec12 = this.particles[1].getPos().subtract(this.particles[0].getPos());
        let dir12 = new Vec2(vec12.getY(), -vec12.getX());
        dir12 = dir12.scalarmult(1/dir12.length2());
        let m12 = this.particles[1].getPos().add(this.particles[0].getPos()).scalarmult(0.5);
        let innerpoint_12 = m12.add(dir12.scalarmult(p.dressTolerance));

        // midpoint 2
        let vec13 = this.particles[0].getPos().subtract(this.particles[2].getPos());
        let dir13 = new Vec2(vec13.getY(), -vec13.getX());
        dir13 = dir13.scalarmult(1/dir13.length2());
        let m13 = this.particles[0].getPos().add(this.particles[2].getPos()).scalarmult(0.5);
        let innerpoint_13 = m13.add(dir13.scalarmult(p.dressTolerance));

        // midpoint 3
        let vec23 = this.particles[2].getPos().subtract(this.particles[1].getPos());
        let dir23 = new Vec2(vec23.getY(), -vec23.getX());
        dir23 = dir23.scalarmult(1/dir23.length2());
        let m23 = this.particles[2].getPos().add(this.particles[1].getPos()).scalarmult(0.5);
        let innerpoint_23 = m23.add(dir23.scalarmult(p.dressTolerance));

        // draw shape between triangle vertices and transformed side-length midpoints
        beginShape();
        curveVertex(startPos.getX(), startPos.getY());
        curveVertex(startPos.getX(), startPos.getY());

        curveVertex(innerpoint_12.getX(), innerpoint_12.getY());

        curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());
        curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());
        curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());

        curveVertex(innerpoint_23.getX(), innerpoint_23.getY());

        curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());
        curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());
        curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());

        curveVertex(innerpoint_13.getX(), innerpoint_13.getY());

        curveVertex(startPos.getX(), startPos.getY());
        curveVertex(startPos.getX(), startPos.getY());
        endShape();
        
        pop();
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }

}
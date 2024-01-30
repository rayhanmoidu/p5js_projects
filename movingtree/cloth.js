class Cloth {
    constructor(mode, startPos, dressHeight, dressWidth, dressOffsetDir, dressOffset) {
        this.springs = [];
        this.particles = [];
        this.fixedIds = [];

        if (mode=="starting") {
            this.setupCloth_starting(new Vec2(300, 100), 500, 200, 1, 100);
        } else if (mode=="dress") {
            this.setupCloth_starting(startPos, dressHeight, dressWidth, dressOffsetDir, dressOffset);
        }

        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    setupCloth_starting(startPos, dressHeight, dressWidth, dressOffsetDir, dressOffset) {
        let se1 = new SpringEndpoint(0, "cloth", new Vec2(startPos.getX(), startPos.getY()), 500, 1);
        let se1_adder = dressOffsetDir == -1 ? dressOffset : 0;
        let se2_adder = dressOffsetDir == 1 ? dressOffset : 0;
        let se1_m = dressOffsetDir == -1 ? 15000 : 10000;
        let se2_m = dressOffsetDir == 1 ? 15000 : 10000;
        let se2 = new SpringEndpoint(1, "cloth", new Vec2(startPos.getX() - dressWidth, startPos.getY() + dressHeight + se1_adder), se1_m, 1);
        let se3 = new SpringEndpoint(2, "cloth", new Vec2(startPos.getX() + dressWidth, startPos.getY() + dressHeight + se2_adder), se2_m, 1);

        se2.setXConstraint(startPos.getX() - 30, true);
        se3.setXConstraint(startPos.getX() + 30, false);

        let r12 = se1.getPos().subtract(se2.getPos()).length2();
        let r13 = se1.getPos().subtract(se3.getPos()).length2();
        let r23 = se2.getPos().subtract(se3.getPos()).length2();

        let tol = 1;
        let s12 = new Spring(0, se1, se2, r12*tol, 15000, 0.05, 1);
        let s13 = new Spring(1, se1, se3, r13*tol, 15000, 0.05, 1);
        let s23 = new Spring(2, se2, se3, r23*tol, 15000, 0.05, 1);

        this.springs = [s12, s13, s23];
        this.particles = [se1, se2, se3];
        this.fixedIds = [0];
    }

    render() {
        push();
        
        noStroke();
        fill(240, 234, 214);
        // triangle(
        //     this.particles[0].getPos().getX(),
        //     this.particles[0].getPos().getY(),
        //     this.particles[1].getPos().getX(),
        //     this.particles[1].getPos().getY(),
        //     this.particles[2].getPos().getX(),
        //     this.particles[2].getPos().getY(),
        // );

        stroke(160);
        strokeWeight(3);
        noStroke();
        // noFill();

        let startPos = this.particles[0].getPos();

        let vec12 = this.particles[1].getPos().subtract(this.particles[0].getPos());
        let dir12 = new Vec2(vec12.getY(), -vec12.getX());
        dir12 = dir12.scalarmult(1/dir12.length2());
        let m12 = this.particles[1].getPos().add(this.particles[0].getPos()).scalarmult(0.5);

        let vec13 = this.particles[0].getPos().subtract(this.particles[2].getPos());
        let dir13 = new Vec2(vec13.getY(), -vec13.getX());
        dir13 = dir13.scalarmult(1/dir13.length2());
        let m13 = this.particles[0].getPos().add(this.particles[2].getPos()).scalarmult(0.5);

        let vec23 = this.particles[2].getPos().subtract(this.particles[1].getPos());
        let dir23 = new Vec2(vec23.getY(), -vec23.getX());
        dir23 = dir23.scalarmult(1/dir23.length2());
        let m23 = this.particles[2].getPos().add(this.particles[1].getPos()).scalarmult(0.5);

        let innerpoint_12 = m12.add(dir12.scalarmult(p.dressTolerance));
        let innerpoint_13 = m13.add(dir13.scalarmult(p.dressTolerance));
        let innerpoint_23 = m23.add(dir23.scalarmult(p.dressTolerance));
        // rotate vec12 by 90, 

        beginShape();
        curveVertex(startPos.getX(), startPos.getY());
        curveVertex(startPos.getX(), startPos.getY());

        curveVertex(innerpoint_12.getX(), innerpoint_12.getY());

        curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());
        curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());
        curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());
        // curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());
        // curveVertex(this.particles[1].getPos().getX(), this.particles[1].getPos().getY());

        curveVertex(innerpoint_23.getX(), innerpoint_23.getY());

        curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());
        curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());
        curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());
        // curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());
        // curveVertex(this.particles[2].getPos().getX(), this.particles[2].getPos().getY());

        curveVertex(innerpoint_13.getX(), innerpoint_13.getY());

        curveVertex(startPos.getX(), startPos.getY());
        curveVertex(startPos.getX(), startPos.getY());

        endShape();





        // spring 1
        let endpoints = this.springs[0].getEndpoints();
        let x1 = endpoints[0].getPos().getX();
        let y1 = endpoints[0].getPos().getY();
        let x2 = endpoints[1].getPos().getX();
        let y2 = endpoints[1].getPos().getY();
        let cp1 = new Vec2(x1 - p.dressX*p.dressTolerance, y1 - p.dressY*p.dressTolerance);
        let cp2 = new Vec2(x2 - p.dressX*p.dressTolerance, y2 + 10*p.dressTolerance);
        curve(cp1.getX(), cp1.getY(), x1, y1, x2, y2, cp2.getX(), cp2.getY())

        // spring 2
        endpoints = this.springs[1].getEndpoints();
        x1 = endpoints[0].getPos().getX();
        y1 = endpoints[0].getPos().getY();
        x2 = endpoints[1].getPos().getX();
        y2 = endpoints[1].getPos().getY();
        cp1 = new Vec2(x1 + p.dressX*p.dressTolerance, y1 - p.dressY*p.dressTolerance);
        cp2 = new Vec2(x2 + p.dressX*p.dressTolerance, y2 - p.dressY*p.dressTolerance);
        curve(cp1.getX(), cp1.getY(), x1, y1, x2, y2, cp2.getX(), cp2.getY())

        // spring 3
        endpoints = this.springs[2].getEndpoints();
        x1 = endpoints[0].getPos().getX();
        y1 = endpoints[0].getPos().getY();
        x2 = endpoints[1].getPos().getX();
        y2 = endpoints[1].getPos().getY();
        cp1 = new Vec2(x1 - p.dressX*p.dressTolerance, y1 + p.dressY*p.dressTolerance);
        cp2 = new Vec2(x2 + p.dressX*p.dressTolerance, y2 + p.dressY*p.dressTolerance);
        
        // curve(cp1.getX(), cp1.getY(), x1, y1, x2, y2, cp2.getX(), cp2.getY())



        // for (let i = 0; i < this.springs.length; i++) {
        //     let endpoints = this.springs[i].getEndpoints();
        //     stroke(100);
        //     strokeWeight(5);
        //     line(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), endpoints[1].getPos().getX(), endpoints[1].getPos().getY())
        // }
        pop();
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }

}
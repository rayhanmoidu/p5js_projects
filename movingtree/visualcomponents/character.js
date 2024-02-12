class Character {
    // 
    constructor(pos, dir) {
        // center position of head
        this.pos = pos;

        // create objects for dress and hair
        this.dress = new Cloth(pos.add(new Vec2(0, p.headRadius+p.neckLength)), p.dressHeight, p.dressWidth, -dir, p.dressHeight*p.dressOffsetFactor);
        this.hair = new Hair(pos, p.headRadius);

        // keep list of springs and particles modelling dress and hair
        this.springs = this.dress.getSprings().concat(this.hair.getSprings());
        this.particles = this.dress.getParticles().concat(this.hair.getParticles());
    }

    render(z) {
        push();

        // head
        fill(156, 115, 87);
        stroke(156, 115, 87);
        strokeWeight(5);
        circle(this.pos.getX(), this.pos.getY(), p.headRadius*2);

        // neck
        noStroke();
        triangle(
            this.pos.getX() - p.neckWidth/2, 
            this.pos.getY(), this.pos.getX() + p.neckWidth/2, this.pos.getY(), 
            this.pos.getX(), this.pos.getY() + p.headRadius+p.neckLength
        );

        // leg
        triangle(
            this.pos.getX() - p.legWidth/2, this.pos.getY() + p.headRadius+p.neckLength + p.dressHeight,
            this.pos.getX() + p.legWidth/2, this.pos.getY() + p.headRadius+p.neckLength + p.dressHeight,
            this.pos.getX(), this.pos.getY() + p.headRadius+p.neckLength + p.dressHeight + p.legLength,
        );

        // eye
        this.renderEye(z);
        
        // dress
        this.dress.render();

        // hair
        this.hair.render();

        pop();
    }

    renderEye(z) {
        let eyeWidth = 22;
        let eyeHeight = 8;

        // eye (white)
        fill(255);
        beginShape();
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());

        curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY() - eyeHeight);
        curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX()- eyeWidth/2, this.pos.getY() + eyeHeight);

        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());
        endShape();

        // eye (black)
        let shiftLimit = 9;

        // get xDiff between camera and character
        let frameShiftX = ((canvasw - (canvasw * (1/p.cubeDepth))) / 2)
        let eyePosX = frameShiftX + (1/z)*this.pos.getX();

        // get pupil shift based on xDiff
        let pupilShift = shiftLimit + (eyePosX / canvasw) * (eyeWidth-shiftLimit*2);
        pupilShift = max(shiftLimit, pupilShift);
        pupilShift = min(eyeWidth-shiftLimit, pupilShift);

        fill(0);
        ellipse(this.pos.getX() - pupilShift, this.pos.getY(), 8, eyeHeight*2);

        // eye (mask) - hides the pupil's overflow from white region
        noStroke();
        fill(156, 115, 87);

        this.renderEyeMask(this.pos, eyeWidth, eyeHeight);
        this.renderEyeMask(this.pos, eyeWidth, -eyeHeight);
    }

    // hides the pupil's overflow from the eye's white region
    renderEyeMask(pos, eyeWidth, eyeHeight) {
        let heightAdder = 5 * (eyeHeight/abs(eyeHeight));
        beginShape();
        
        curveVertex(pos.getX() - eyeWidth - 4, pos.getY());
        curveVertex(pos.getX() - eyeWidth - 4, pos.getY());

        curveVertex(pos.getX() - eyeWidth, pos.getY());
        curveVertex(pos.getX() - eyeWidth, pos.getY());

        curveVertex(pos.getX() - eyeWidth/2, pos.getY() + eyeHeight);

        curveVertex(pos.getX(), pos.getY());
        curveVertex(pos.getX(), pos.getY());

        curveVertex(pos.getX() + 4, pos.getY());
        curveVertex(pos.getX() + 4, pos.getY());
        curveVertex(pos.getX() + 4, pos.getY());

        curveVertex(pos.getX(), pos.getY() + (eyeHeight + heightAdder));

        curveVertex(pos.getX() - eyeWidth/2, pos.getY() + (eyeHeight + heightAdder));

        curveVertex(pos.getX() - eyeWidth, pos.getY() + (eyeHeight + heightAdder));

        curveVertex(pos.getX() - eyeWidth - 4, pos.getY());
        curveVertex(pos.getX() - eyeWidth - 4, pos.getY());
        endShape();
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }
}
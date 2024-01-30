class Character {
    // pos should be the center of the head
    constructor(pos, dir) {
        this.pos = pos;
        this.dress = new Cloth("dress", pos.add(new Vec2(0, 25+10)), p.dressHeight, p.dressWidth, -dir, p.dressHeight / 6);
        this.hair = new Hair("head", pos, 25);
        this.springs = this.dress.getSprings().concat(this.hair.getSprings());
        this.particles = this.dress.getParticles().concat(this.hair.getParticles());
    }

    render(z, groundHeight) {
        push();

        // print(z, this.pos)

        // head
        fill(156, 115, 87);
        stroke(156, 115, 87);
        strokeWeight(5);
        circle(this.pos.getX(), this.pos.getY(), 50);

        // neck
        noStroke();
        triangle(this.pos.getX() - 5, this.pos.getY(), this.pos.getX() + 5, this.pos.getY(), this.pos.getX(), this.pos.getY() + 25+10)

        let oldpos = this.pos;
        // eye
        let eyeWidth = 22;
        let eyeHeight = 8;

        // eye (white)
        fill(255);
        // beginShape();
        // curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY());
        // curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY());

        // curveVertex(this.pos.getX(), this.pos.getY() - eyeHeight);
        // curveVertex(this.pos.getX() + eyeWidth/2, this.pos.getY());
        // curveVertex(this.pos.getX() + eyeWidth/2, this.pos.getY());
        // curveVertex(this.pos.getX() + eyeWidth/2, this.pos.getY());
        // curveVertex(this.pos.getX(), this.pos.getY() + eyeHeight);

        // curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY());
        // curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY());
        // endShape();
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
        let shiftx = ((canvasw - (canvasw * (1/cubeDepth))) / 2)
        // let shifty = (canvash - (canvash * (1/this.z))) * (1 - (groundHeight / canvash))
        let eyePosX = shiftx + (1/z)*this.pos.getX();

        // let theta = atan(z*100 / eyePosX);
        // let eyePos = eyeWidth * tan(theta);

        let tol = 9;
        let eyeshift = tol + (eyePosX / canvasw) * (eyeWidth-tol*2);
        eyeshift = max(tol, eyeshift);
        eyeshift = min(eyeWidth-tol, eyeshift);
        // let eyePosY = shifty + (1/z)*this.pos.getY();
        // print(shiftx)
        // if (eyePosX < 300) {
        // print(shiftx, eyePosX)
        // }

        // print(theta, z*100 / eyePosX)
        fill(0);
        ellipse(this.pos.getX() - eyeshift, this.pos.getY(), 8, eyeHeight*2);

        // eye (mask)
        noStroke();
        fill(156, 115, 87);

        beginShape();
        
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());

        curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY() - eyeHeight);
        curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());

        

        curveVertex(this.pos.getX(), this.pos.getY() - (eyeHeight + 5));
        curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY() - (eyeHeight + 5));
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY() - (eyeHeight + 5));

        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        endShape();

        beginShape();
        
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());

        curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY() + eyeHeight);
        curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());

        

        curveVertex(this.pos.getX(), this.pos.getY() + (eyeHeight + 5));
        curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY() + (eyeHeight + 5));
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY() + (eyeHeight + 5));

        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        endShape();

        rect(this.pos.getX() - eyeWidth - 4, this.pos.getY() - 3, 4, 6);
        rect(this.pos.getX(), this.pos.getY() - 3, 4, 6);

        // leg
        fill(156, 115, 87);
        triangle(
            this.pos.getX() - 5, this.pos.getY() + 25 + 10 + p.dressHeight,
            this.pos.getX() + 5, this.pos.getY() + 25 + 10 + p.dressHeight,
            this.pos.getX(), this.pos.getY() + 25 + 10 + p.dressHeight + 100,
        )

        pop();
        
        this.dress.render();

        

        this.hair.render();
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }


}
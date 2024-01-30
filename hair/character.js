class Character {
    // pos should be the center of the head
    constructor(pos, dir) {
        this.pos = pos;
        this.dress = new Cloth("dress", pos.add(new Vec2(0, 50)), 300, 100, -dir, 50);
        this.hair = new Hair("head", pos, 25);
        this.springs = this.dress.getSprings().concat(this.hair.getSprings());
        this.particles = this.dress.getParticles().concat(this.hair.getParticles());
    }

    render() {
        push();
        fill(156, 115, 87);
        stroke(156, 115, 87);
        strokeWeight(5);
        circle(this.pos.getX(), this.pos.getY(), 50);
        line(this.pos.getX(), this.pos.getY(), this.pos.getX(), this.pos.getY() + 50);


        fill(255);
        noStroke();
        let eyeWidth = 22;
        let eyeHeight = 7;

        // arc(this.pos.getX() - eyeWidth/2, this.pos.getY(), eyeWidth, eyeHeight*2, 0, 2*PI)
        // arc(this.pos.getX() - eyeWidth/2, this.pos.getY(), eyeWidth, eyeHeight*2, 0, PI)

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

        fill(0);


        ellipse(this.pos.getX() - (eyeWidth/2 + p.eyeOffset), this.pos.getY(), 8, eyeHeight*2);

        fill(156, 115, 87);
        //156, 115, 87

        beginShape();
        
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY());

        curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY() - eyeHeight);
        curveVertex(this.pos.getX(), this.pos.getY());
        // curveVertex(this.pos.getX(), this.pos.getY());
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
        // curveVertex(this.pos.getX(), this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());
        curveVertex(this.pos.getX() + 4, this.pos.getY());

        

        curveVertex(this.pos.getX(), this.pos.getY() + (eyeHeight + 5));
        curveVertex(this.pos.getX() - eyeWidth/2, this.pos.getY() + (eyeHeight + 5));
        curveVertex(this.pos.getX() - eyeWidth, this.pos.getY() + (eyeHeight + 5));

        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        curveVertex(this.pos.getX() - eyeWidth - 4, this.pos.getY());
        endShape();


        fill(100);
        rect(this.pos.getX() - eyeWidth - 4, this.pos.getY() - 3, 4, 6);
        rect(this.pos.getX(), this.pos.getY() - 3, 4, 6);
        
        pop();

        this.hair.render();
        this.dress.render();
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }


}
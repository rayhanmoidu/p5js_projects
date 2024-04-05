class Persona {
    constructor(id, pos, scale, endpos) {
        this.id = id;
        this.scale = scale;

        // position
        this.pos = pos;
        this.endpos = endpos;
        this.dir = new Vec2(0, 0);
        this.completeTrajectory = false;

        // opacity
        this.opacityFactor = 1;
        this.beginFadeOut = false;
    }

    update() {

        // update position towards direction
        this.pos = this.pos.add(this.dir.scalarmult(45 * p.personaSpeed / this.getFrameRate()));

        // begin fade out when position gets too close to endpos
        let dist = this.endpos.subtract(this.pos).length2();
        if (dist < s.fadeDist*this.scale && !this.completeTrajectory) {
            this.beginFadeOut = true;
        }

        // fade persona out
        if (this.beginFadeOut) {
            this.opacityFactor -= p.personaSpeed*2;
            this.opacityFactor = max(0, this.opacityFactor);

            // signal to parent that persona is faded out (by returning 1)
            if (this.opacityFactor <= 0) {
                this.completeTrajectory = true;
                this.beginFadeOut = false;
                return 1;
            }
        }

        return 0;
    }

    // assigns new direction for persona to head in
    assignNewDestination(destpos) {
        this.dir = destpos.subtract(this.pos);
    }

    // draws a neon persona
    draw(graphicsObject) {
        graphicsObject.push();

        graphicsObject.translate(this.pos.getX(), this.pos.getY());
        graphicsObject.scale(this.scale);

        // shadow
        graphicsObject.noFill();
        graphicsObject.stroke(111,107,72, 255*this.opacityFactor);
        graphicsObject.strokeWeight(16);
        this.drawStrokes(graphicsObject);

        // main line
        graphicsObject.noFill();
        graphicsObject.stroke(255, 255, 112, 255*this.opacityFactor);
        graphicsObject.strokeWeight(6);
        this.drawStrokes(graphicsObject);

        // white highlight
        graphicsObject.noFill();
        graphicsObject.stroke(255, 255, 255, 255*this.opacityFactor);
        graphicsObject.strokeWeight(1);
        this.drawStrokes(graphicsObject);

        graphicsObject.pop();
    }

    // draws a persona with parent's state
    drawStrokes(graphicsObject) {
        // body
        graphicsObject.line(0, -s.stickHeight*0.3, 0, -s.stickHeight + s.headRadius/2);

        // legs
        graphicsObject.line(0, -s.stickHeight*0.3, -s.stickWidth/2, 0);
        graphicsObject.line(0, -s.stickHeight*0.3, s.stickWidth/2, 0);

        // arms
        graphicsObject.line(0, -s.stickHeight*0.675, -s.stickWidth/2, -s.stickHeight*0.45);
        graphicsObject.line(0, -s.stickHeight*0.675, s.stickWidth/2, -s.stickHeight*0.45);

        // head
        graphicsObject.circle(0, -s.stickHeight, s.headRadius);
    }

    // GETTER & SETTERS

    getPos() {
        return this.pos;
    }

    getFrameRate() {
        let finalFrameRate = frameRate();
        finalFrameRate = min(65, finalFrameRate);
        finalFrameRate = max(15, finalFrameRate);
        return finalFrameRate;
    }
}
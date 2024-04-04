class Persona {
    constructor(id, hill, pos, scale, endpos) {
        this.id = id;
        this.pos = pos;
        this.destpos = new Vec2(0, 0);
        this.dir = new Vec2(0, 0);
        this.scale = scale;
        this.endpos = endpos;
        this.hill = hill;

        this.opacityFactor = 1;

        this.offset = new Vec2(random(-50, 0), random(0, 50));

        this.beginFadeOut = false;
        this.complete = false;
    }

    update() {
        // print(this.dir)


            let finalFrameRate = frameRate();
            finalFrameRate = min(65, finalFrameRate);
            finalFrameRate = max(15, finalFrameRate)
            this.pos = this.pos.add(this.dir.scalarmult(45 * s.personaSpeed / finalFrameRate));

            let dist = this.endpos.subtract(this.pos).length2();
            if (dist < s.fadeDist*this.scale && !this.complete) {
                this.beginFadeOut = true;
            }

            if (this.beginFadeOut) {
                this.opacityFactor -= s.personaSpeed*2;
                this.opacityFactor = max(0, this.opacityFactor);

                if (this.opacityFactor <= 0) {
                    this.complete = true;
                    this.beginFadeOut = false;
                    return 1;
                }
            }
            // // let dist = this.hill.getDist(this.pos);
            // if (this.opacityFactor > 0 && dist < s.fadeDist) {
            //     // print(dist, this.id)
            //     this.opacityFactor = map(dist, 5, s.fadeDist, 0, 1);
            //     // return 1;
            //     if (this.opacityFactor <= 0) {
            //         return 1;
            //     }
            // }
            
            

        return 0;

        // if (this.opacityFactor <= 0.1) {
        //     const index = personas.indexOf(this);
        //     if (index > -1) {
        //         personas.splice(index, 1);
        //     }
        // }
    }

    assignNewDestination(destpos) {
        this.destpos = destpos;
        this.dir = destpos.subtract(this.pos);
    }

    getPos() {
        return this.pos;
    }

    draw(graphicsObject, t) {
        // print(t)
        graphicsObject.push();

        graphicsObject.translate(this.pos.getX() + this.offset.getX()*t, this.pos.getY() + this.offset.getY()*t);
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
        // fill(16, 12, 47);
        graphicsObject.circle(0, -s.stickHeight, s.headRadius);
    }
}
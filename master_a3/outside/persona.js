class Persona {
    constructor(pos, scale, endpos) {
        this.pos = pos;
        this.destpos = new Vec2(0, 0);
        this.dir = new Vec2(0, 0);
        this.scale = scale;
        this.endpos = endpos;

        this.opacityFactor = 1;
    }

    update() {
        // print(this.dir)
        this.pos = this.pos.add(this.dir.scalarmult(45 * s.personaSpeed / frameRate()));

        let dist = this.endpos.subtract(this.pos).length2();
        if (this.opacityFactor > 0 && dist < s.fadeDist) {
            this.opacityFactor = map(dist, 5, s.fadeDist, 0, 1);

            if (this.opacityFactor <= 0) {
                return 1;
            }
        }
        
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
class Persona {
    constructor(pos, scale) {
        this.pos = pos;
        this.destpos = new Vec2(0, 0);
        this.dir = new Vec2(0, 0);
        this.scale = scale;

        this.opacityFactor = 1;
    }

    update() {
        this.pos = this.pos.add(this.dir.scalarmult(s.personaSpeed));
    }

    assignNewDestination(destpos) {
        this.destpos = destpos;
        this.dir = destpos.subtract(this.pos).normalize();
    }

    getPos() {
        return this.pos;
    }

    draw() {
        push();

        translate(this.pos.getX(), this.pos.getY());
        scale(s.scale);

        // shadow
        noFill();
        stroke(111,107,72, 255*this.opacityFactor);
        strokeWeight(16);

        this.drawStrokes();

        // main line
        noFill();
        stroke(255, 255, 112, 255*this.opacityFactor);
        strokeWeight(6);
        this.drawStrokes();

        // white highlight
        noFill();
        stroke(255, 255, 255, 255*this.opacityFactor);
        strokeWeight(1);
        this.drawStrokes();

        pop();
    }

    drawStrokes() {
        // body
        line(0, -s.stickHeight*0.3, 0, -s.stickHeight + s.headRadius/2);

        // legs
        line(0, -s.stickHeight*0.3, -s.stickWidth/2, 0);
        line(0, -s.stickHeight*0.3, s.stickWidth/2, 0);

        // arms
        line(0, -s.stickHeight*0.675, -s.stickWidth/2, -s.stickHeight*0.45);
        line(0, -s.stickHeight*0.675, s.stickWidth/2, -s.stickHeight*0.45);

        // head
        // fill(16, 12, 47);
        circle(0, -s.stickHeight, s.headRadius);
    }
}
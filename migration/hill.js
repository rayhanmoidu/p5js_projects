class Hill {
    constructor(id, vertices, baseWidth, scale, endpos_min, endpos_max) {
        this.id = id;
        this.vertices = vertices;
        this.baseWidth = baseWidth;
        this.scale = scale;

        this.endpos_min = endpos_min;
        this.endpos_max = endpos_max;
    }

    draw() {
        push();

        // shadow
        fill(16, 12, 47);
        // fill(255)
        stroke(10, 108, 224, 100);
        strokeWeight(25);
        this.drawStroke();

        // main line
        noFill();
        stroke(10, 108, 224);
        strokeWeight(10);
        this.drawStroke();

        // white highlight
        stroke(255);
        strokeWeight(1);
        this.drawStroke();

        pop();
    }

    drawStroke() {
        beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
            curveVertex(this.vertices[i].getX(), this.vertices[i].getY());
        }
        endShape();
    }

    getEndPos() {
        let endpos_x = random(this.endpos_min, this.endpos_max);
        for (let i = 0; i < this.vertices.length - 1; i++) {
            if (endpos_x >= this.vertices[i].getX() && endpos_x <= this.vertices[i+1].getX()) {
                let startpos = this.vertices[i];
                let diff = this.vertices[i+1].subtract(this.vertices[i]);
                let xDiff = endpos_x - this.vertices[i].getX();
                let perc = xDiff / (this.vertices[i+1].getX() - this.vertices[i].getX());
                return startpos.add(diff.scalarmult(perc));
            }
        }
        return new Vec2(0, 0); 
    }

    testStartPos_x(start_x) {
        return start_x > this.endpos_min && start_x < this.endpos_max;
    }

    getVertices() {
        return this.vertices;
    }

    getBaseWidth() {
        return this.baseWidth;
    }

    getScale() {
        return this.scale;
    }
}
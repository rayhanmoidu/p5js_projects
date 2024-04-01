class Hill {
    constructor(id, vertices, baseWidth, scale, endpos_min, endpos_max) {
        this.id = id;
        this.vertices = vertices;
        this.baseWidth = baseWidth;
        this.scale = scale;

        this.endpos_min = endpos_min;
        this.endpos_max = endpos_max;
    }

    draw(graphicsObject) {
        graphicsObject.push();

        // shadow
        graphicsObject.fill(16, 12, 47);
        // fill(255)
        graphicsObject.stroke(10, 108, 224, 100);
        graphicsObject.strokeWeight(25);
        this.drawStroke(graphicsObject);

        // main line
        graphicsObject.noFill();
        graphicsObject.stroke(10, 108, 224);
        graphicsObject.strokeWeight(10);
        this.drawStroke(graphicsObject);

        // white highlight
        graphicsObject.stroke(255);
        graphicsObject.strokeWeight(1);
        this.drawStroke(graphicsObject);

        graphicsObject.pop();
    }

    drawStroke(graphicsObject) {
        graphicsObject.beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
            graphicsObject.curveVertex(this.vertices[i].getX(), this.vertices[i].getY());
        }
        graphicsObject.endShape();
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
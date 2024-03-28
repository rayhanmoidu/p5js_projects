class Hill {
    constructor(id, vertices, baseWidth, scale) {
        this.id = id;
        this.vertices = vertices;
        this.baseWidth = baseWidth;
        this.scale = scale;
    }

    draw() {
        push();

        // shadow
        fill(16, 12, 47);
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
class Hill {
    constructor(vertexPositions) {
        this.vertexPositions = vertexPositions;
    }

    draw() {
        push();

        // shadow
        fill(16, 12, 47);
        stroke(10, 108, 224, 100);
        strokeWeight(25);
        beginShape();
        for (let i = 0; i < this.vertexPositions.length; i++) {
            curveVertex(this.vertexPositions[i].getX(), this.vertexPositions[i].getY());
        }
        endShape();

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
        for (let i = 0; i < this.vertexPositions.length; i++) {
            curveVertex(this.vertexPositions[i].getX(), this.vertexPositions[i].getY());
        }
        endShape();
    }
}
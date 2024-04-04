class Hill {
    constructor(id, vertices, scale, endpos_min, endpos_max, startpos_xbounds, startpos_piecewise) {
        this.id = id;
        this.scale = scale;

        this.vertices = vertices; // vertices defining hill
        this.startpos_piecewise = startpos_piecewise; // vertices defining startpos function
        this.startpos_xbounds = startpos_xbounds; // bounds for start_x

        // bounds for end_x
        this.endpos_min = endpos_min;
        this.endpos_max = endpos_max;
    }

    // draws hill vertices as neon curve
    draw(graphicsObject) {
        graphicsObject.push();

        // shadow
        graphicsObject.fill(16, 12, 47);
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

    // draws hill vertices as bezier curve, using parent's state 
    drawStroke(graphicsObject) {
        graphicsObject.beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
            graphicsObject.curveVertex(this.vertices[i].getX(), this.vertices[i].getY());
        }
        graphicsObject.endShape();
    }

    // **************** HELPERS FOR PERSONA STRING CREATION ****************

    // returns a random end_pos for a new persona string
    getEndPos(startpos) {

        // if castle hill, send string to castle with 60% chance
        if (this.id == 2) {
            if (random() < 0.6) {
                return new Vec2(s.outsideworld_w*0.35, s.outsideworld_h*0.3);
            }
        }

        // get random end_x pos
        let endpos_x = random(this.endpos_min, this.endpos_max);

        // ensure end_x is far enough from start_x
        while (abs(endpos_x - startpos.getX()) < 150) {
            endpos_x = random(this.endpos_min, this.endpos_max);
        }

        // if castle hill, and string not sent to castle, ensure end_x won't intersect with castle
        if (this.id == 2) {
            while (this.doesEndPosX_IntersectCastle(endpos_x)) {
                endpos_x = random(this.endpos_min, this.endpos_max) 
            }
        }

        // get end_y from end_x using hill vertices as piecewise function
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

    // returns true if end_x would cause intersection with castle
    doesEndPosX_IntersectCastle(ep_x) {
        if (ep_x > s.outsideworld_w * 0.275 && ep_x < s.outsideworld_w * 0.275 + s.castleW) {
            return true;
        }
        return false;
    }

    // returns a random start_pos for a new persona string
    getStartPos() {

        // get random start_x
        let x_bounds = this.startpos_xbounds;
        let start_x = random(x_bounds[0], x_bounds[1]);

        // ensure start_x is not close to potential end_x
        while (this.testStartPos_x(start_x)) {
            start_x = random(x_bounds[0], x_bounds[1]);
        }

        return new Vec2(start_x, this.getStartY(start_x));
    }

    // returns the corresponding start_y for a given start_x, based on input startpos_piecewise function
    getStartY(start_x) {

        // go through startpos_piecewise vertices
        for (let i = 0; i < this.startpos_piecewise.length - 1; i++) {
            let cur = this.startpos_piecewise[i];
            let next = this.startpos_piecewise[i + 1];

            // if start_x is between cur and next, return the y-value of start_x along this line segment
            if (cur.getX() < start_x && next.getX() > start_x) {
                let slope = (next.getY() - cur.getY()) / (next.getX() - cur.getX());
                if (slope) {
                    return cur.getY() + (slope * (start_x - cur.getX()));
                } else {
                    return cur.getY();
                }
            }
        }
    }

    // ensure start_x is outside endpos boundaries
    testStartPos_x(start_x) {
        return start_x > this.endpos_min && start_x < this.endpos_max;
    }

    // GETTERS / SETTERS

    getVertices() {
        return this.vertices;
    }

    getScale() {
        return this.scale;
    }
}
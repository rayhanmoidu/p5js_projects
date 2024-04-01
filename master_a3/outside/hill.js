class Hill {
    constructor(id, vertices, scale, endpos_min, endpos_max, startpos_xbounds, startpos_piecewise) {
        this.id = id;
        this.vertices = vertices;
        // this.baseWidth = baseWidth;
        this.scale = scale;
        this.startpos_piecewise = startpos_piecewise;
        this.startpos_xbounds = startpos_xbounds;

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

    getEndPos(startpos) {
        if (this.id == 2) {
            let rand = random();
            if (rand < 0.333) {
                print("hello")
                let lala = new Vec2(s.w*0.35, s.h*0.3);
                print(lala)
                return lala;
            }
        }

        let start_x = this.startpos_xbounds[0];
        let end_x = this.startpos_xbounds[1];
        let startpos_xperc = (startpos.getX() - start_x) / (end_x - start_x);

        let minp, maxp;
        if (startpos_xperc > 0.5) {
            minp = 0;
            maxp = 1 - startpos_xperc;
        } else {
            minp = 1 - startpos_xperc;
            maxp = 0;
        }

        print(minp, maxp)

        let endpos_x = this.endpos_min + (random(minp, maxp) * (this.endpos_max - this.endpos_min))

        // if id is 2, make sure endposx is not at castle

        // let endpos_x = random(this.endpos_min, this.endpos_max);
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

    getStartPos() {
        let x_bounds = this.startpos_xbounds;

        let start_x = random(x_bounds[0], x_bounds[1]);
        while (this.testStartPos_x(start_x)) {
            start_x = random(x_bounds[0], x_bounds[1]);
        }

        let ret = new Vec2(start_x, this.getStartY(start_x));

        if (this.id == 0) {
            print("here", ret)
        }
        return ret;
    }

    getStartY(start_x) {
        for (let i = 0; i < this.startpos_piecewise.length - 1; i++) {
            let cur = this.startpos_piecewise[i];
            let next = this.startpos_piecewise[i + 1];
            if (cur.getX() < start_x && next.getX() > start_x) {
                let slope = (next.getY() - cur.getY()) / (next.getX() - cur.getX());
                print(slope)
                if (slope!=undefined) {
                    return cur.getY() + (slope * (start_x - cur.getX()));
                } else {
                    return cur.getY();
                }
            }
        }
    }

    testStartPos_x(start_x) {
        return start_x > this.endpos_min && start_x < this.endpos_max;
    }

    getVertices() {
        return this.vertices;
    }

    // getBaseWidth() {
    //     return this.baseWidth;
    // }

    getScale() {
        return this.scale;
    }
}
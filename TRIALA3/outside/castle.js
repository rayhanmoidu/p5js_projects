class Castle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(graphicsObject) {
        graphicsObject.push();

        graphicsObject.translate(this.x, this.y);
        graphicsObject.fill(16, 12, 47)
        graphicsObject.noStroke()

        graphicsObject.beginShape();
        graphicsObject.curveVertex(-30, 0);
        graphicsObject.curveVertex(-30, 0);
        graphicsObject.curveVertex(this.w*0.1, this.h*1.2);
        graphicsObject.curveVertex(this.w*0.1, this.h*1.2);
        graphicsObject.curveVertex(this.w*0.9, this.h*1.2);
        graphicsObject.curveVertex(this.w*0.9, this.h*1.2);
        graphicsObject.curveVertex(this.w*1.1, 0);
        graphicsObject.curveVertex(this.w*1.1, 0);
        graphicsObject.curveVertex(-30, 0);
        graphicsObject.curveVertex(-30, 0);
        graphicsObject.endShape();
        // graphicsObject.rect(-6, 0, this.w, this.h);

        //  ****** bottom line ****** 
        let v1 = new Vec2(this.w*0.2, this.h*0.8);
        let v2 = new Vec2(this.w*0.2, this.h*0.8);
        let v3 = new Vec2(this.w*0.5, this.h*0.7);
        let v6 = new Vec2(this.w*0.8, this.h*0.8);
        let v7 = new Vec2(this.w*0.8, this.h*0.8);
        this.drawStroke_bezier(graphicsObject, [v1, v2, v3, v6, v7])

        

        // ****** wall ****** 

        // front-top
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.25, this.h*0.3), new Vec2(this.w*0.75, this.h*0.3));

        // back-top
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.05, this.h*0.15), new Vec2(this.w*0.55, this.h*0.15));

        // depth-lines
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.25, this.h*0.3), new Vec2(this.w*0.05, this.h*0.15));
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.75, this.h*0.3), new Vec2(this.w*0.55, this.h*0.15));

        v1 = new Vec2(this.w*0.05, this.h*0.6);
        v2 = new Vec2(this.w*0.05, this.h*0.6);
        v3 = new Vec2(this.w*0.175, this.h*0.6);
        v6 = new Vec2(this.w*0.25, this.h*0.75);
        v7 = new Vec2(this.w*0.25, this.h*0.75);
        this.drawStroke_bezier(graphicsObject, [v1, v2, v3, v6, v7])

        // front-left spike
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.2, this.h*0.8), new Vec2(this.w*0.15, this.h*0.1));
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.25, this.h*0.75), new Vec2(this.w*0.225, this.h*0.1));

        // front-right spike
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.8, this.h*0.8), new Vec2(this.w*0.85, this.h*0.1));
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.75, this.h*0.75), new Vec2(this.w*0.775, this.h*0.1));

        // back-left spike
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.05, this.h*0.6), new Vec2(this.w*-0.05, this.h*0.05))

        // back-right spike
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.55, this.h*0.15), new Vec2(this.w*0.545, this.h*0.05))
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.65, this.h*0.2), new Vec2(this.w*0.655, this.h*0.05))

        // back-left line
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.05, this.h*0.05), new Vec2(this.w*0.1, this.h*0.6));

        

        


        //  ****** triangles ****** 
        this.drawStroke_traingle(graphicsObject, new Vec2(this.w*0.15, this.h*0.1), new Vec2(this.w*0.225, this.h*0.1), new Vec2(this.w*0.1875, this.h*0));
        this.drawStroke_traingle(graphicsObject, new Vec2(this.w*0.85, this.h*0.1), new Vec2(this.w*0.775, this.h*0.1), new Vec2(this.w*0.8125, this.h*0));
        this.drawStroke_traingle(graphicsObject, new Vec2(this.w*0.05, this.h*0.05), new Vec2(this.w*-0.05, this.h*0.05), new Vec2(this.w*0, this.h*-0.05));
        this.drawStroke_traingle(graphicsObject, new Vec2(this.w*0.545, this.h*0.05), new Vec2(this.w*0.655, this.h*0.05), new Vec2(this.w*0.6, this.h*-0.05));

        //  ****** door ****** 
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.4, this.h*0.7), new Vec2(this.w*0.375, this.h*0.4));
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.6, this.h*0.7), new Vec2(this.w*0.625, this.h*0.4));
        this.drawStroke_line(graphicsObject, new Vec2(this.w*0.375, this.h*0.4), new Vec2(this.w*0.625, this.h*0.4));

        graphicsObject.pop();
    }

    drawStroke_traingle(graphics_object, v1, v2, v3) {
        this.drawStroke_line(graphics_object, v1, v2);
        this.drawStroke_line(graphics_object, v1, v3);
        this.drawStroke_line(graphics_object, v2, v3);
    }

    drawStroke_line(graphicsObject, v1, v2) {
        // shadow
        graphicsObject.noFill();
        // graphicsObject.stroke(111,13,123,255);
        graphicsObject.stroke(255, 16, 240, 100);
        graphicsObject.strokeWeight(6);

        this.drawLine(graphicsObject, v1, v2);

        // main line
        graphicsObject.noFill();
        graphicsObject.stroke(255, 16, 240, 255);
        graphicsObject.strokeWeight(3);
        this.drawLine(graphicsObject, v1, v2);

        // white highlight
        graphicsObject.noFill();
        graphicsObject.stroke(255, 255, 255, 255);
        graphicsObject.strokeWeight(1);
        this.drawLine(graphicsObject, v1, v2);
    }

    drawStroke_bezier(graphicsObject, vertices) {
         // shadow
         graphicsObject.noFill();
         graphicsObject.stroke(255, 16, 240, 100);
         graphicsObject.strokeWeight(6);
 
         this.drawBezier(graphicsObject, vertices);
 
         // main line
         graphicsObject.noFill();
         graphicsObject.stroke(255, 16, 240, 255);
         graphicsObject.strokeWeight(3);
         this.drawBezier(graphicsObject, vertices);
 
         // white highlight
         graphicsObject.noFill();
         graphicsObject.stroke(255, 255, 255, 255);
         graphicsObject.strokeWeight(1);
         this.drawBezier(graphicsObject, vertices);
    }

    drawLine(graphicsObject, v1, v2) {
        graphicsObject.line(v1.getX(), v1.getY(), v2.getX(), v2.getY());
    }

    drawBezier(graphicsObject, vertices) {
        graphicsObject.beginShape();
        for (let i = 0; i < vertices.length; i++) {
            graphicsObject.curveVertex(vertices[i].getX(), vertices[i].getY());
        }
        graphicsObject.endShape();
    }
}
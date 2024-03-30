class World_Inside {
    constructor() {
        this.melting_bust = new MeltingBust();
        // this.melting_bust.setTargetFace(target_face);
        this.f = new Vec2(0, 0);
        this.x0 = new Vec2(bust_default.width/2, bust_default.height/2);
    }

    update() {
        if (hasFaceCapture) {
            // print(cv_helper.getFaceCapture())
            this.melting_bust.setTargetFace(cv_helper.getFaceCapture());
        }
        // only do this if force has changed?
        this.melting_bust.melt(this.x0, new Vec2(s.fx, cv_helper.getRestPeriod()/10));
    }

    draw() {
        push();

        this.melting_bust.draw();
        this.drawWindowFrame();

        pop();
    }

    drawBust() {

    }

    drawWindowFrame() {
        push();
        translate(-width/2 + 25, -height/2 + 25);
        scale(1.3);
        image(windowframe, 0, 0);
        pop();
    }
}
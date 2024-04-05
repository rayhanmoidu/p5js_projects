class World_Inside {
    constructor() {
        this.melting_bust = new MeltingBust();
        // this.melting_bust.setTargetFace(target_face);
        this.f = new Vec2(0, 0);
        this.x0 = new Vec2(bust_default.width/2, bust_default.height/2);
        this.hasMelted = false;
    }

    update() {
        // if (hasFaceCapture) {
        //     // print(cv_helper.getFaceCapture())
        //     this.melting_bust.setTargetFace(cv_helper.getFaceCapture());
        // }
        // only do this if force has changed?
        // this.melting_bust.melt(this.x0, new Vec2(s.fx, cv_helper.getRestPeriod()));

        // this.melting_bust.melt(did_melt, this.x0, new Vec2(s.fx, cv_helper.getRestPeriod()/5));

        if (did_melt) {
            this.hasMelted = true;
            this.melting_bust.melt(this.x0, new Vec2(s.fx, cv_helper.getRestPeriod()/5));
        } else {
            this.melting_bust.fillEyes();
            if (this.hasMelted) {
                this.hasMelted = false;
                // print(bust_default.pixels.length, this.melting_bust.getPixels().length)
                bust_previous.pixels = bust_default.pixels;

                for (let i = 0; i < bust_default.pixels.length; i += 4) {
                    let curLoc = new Vec2((i/4) % bust_default.width, floor((i/4) / bust_default.width));
                    if (this.melting_bust.getPicker(curLoc.getY(), curLoc.getX())) {
                        for (let ii = 0; ii < 4; ii++) {
                            bust_previous.pixels[i + ii] = bust_dynamic.pixels[i + ii];
                        }
                    }
                }
                bust_previous.updatePixels();
            }
            this.melting_bust.resetPicker();
        }
    }

    draw() {
        push();

        this.melting_bust.draw();

        bust_previous.updatePixels();
        bust_dynamic.updatePixels();

                // print(this.bust.pixels)
                scale(0.5)
                translate(-1400, 0)
                // print(height, (-height/2 + height - this.bust.height) + this.bust.height)
                imageMode(CORNER)
                image(bust_previous, 0, 0)
        
                translate(700, 0)
                // print(height, (-height/2 + height - this.bust.height) + this.bust.height)
                imageMode(CORNER)
                image(bust_dynamic, 0, 0)
        // this.drawWindowFrame();

        pop();
    }

    drawBust() {

    }

    drawWindowFrame() {
        push();
        translate(-width/2 + 50, -height/2 + -50);
        scale(0.85);
        image(windowframe, 0, 0);
        pop();
    }
}
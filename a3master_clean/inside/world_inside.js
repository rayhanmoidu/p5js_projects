class World_Inside {
    constructor() {

        // melting bust
        this.melting_bust = new MeltingBust();
        this.isBustMelting = false;
        this.reversionCounter = 0;

        // position where force is incited for Kelvinlet operation (melting)
        this.x0 = new Vec2(bust_default.width/2, bust_default.height/2);
    }

    update() {
        if (shouldMelt) { // shouldMelt is set by cv_helper, upon prolonged rest period
            this.isBustMelting = true;

            // melt bust using Kelvinlet operation, with a downwards force correlating to length of rest period
            this.melting_bust.melt(this.x0, new Vec2(0, cv_helper.getMeltingForce()*p.meltingSpeed));

        } else if (shouldRevertToDefaultBust) { // shouldRevert is set by cv_helper, when no face in view for long time

            // update eyes and revert
            this.melting_bust.updateEyes();
            this.melting_bust.revertToDefault();
            this.reversionCounter += 1;

            // will execute when reversion complete
            if (this.reversionCounter > 500) {
                this.reversionCounter = 0;
                finishedRevertingToDefaultBust = true;
                shouldRevertToDefaultBust = false;

                this.melting_bust.resetPicker();
            }
        } else {

            // update eyes based on eyeIndex set by cv_helper
            this.melting_bust.updateEyes();

            // body of if-statement executes when bust finishes snapping back up
            if (this.isBustMelting) {
                this.isBustMelting = false;

                // set previousBust buffer to current finalBust
                for (let i = 0; i < bust_default.pixels.length; i += 4) {
                    let curLoc = new Vec2((i/4) % bust_default.width, floor((i/4) / bust_default.width));

                    if (this.melting_bust.getPicker(curLoc.getY(), curLoc.getX())) {
                        for (let ii = 0; ii < 4; ii++) {
                            previousBust.pixels[i + ii] = videoBust.pixels[i + ii];
                        }
                    }
                }

                // clear picker back to false
                this.melting_bust.resetPicker();
            }
        }
    }

    draw() {
        push();

        this.melting_bust.draw();
        this.drawWindowFrame();

        pop();
    }

    // draws the window frame
    drawWindowFrame() {
        push();
        translate(-width/2 + 50, -height/2 + -50);
        scale(0.85);
        image(windowframe, 0, 0);
        pop();
    }
}
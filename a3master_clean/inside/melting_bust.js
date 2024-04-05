class MeltingBust {
    constructor() {

        // finalBust buffer
        this.bust = createGraphics(bust_default.width/2, bust_default.height/2, WEBGL);
        this.bust.setAttributes("alpha", true);

        // load pixels for all masks and buffers
        bust_default.loadPixels();
        eye_hair_mask.loadPixels();
        videoBust.loadPixels();
        previousBust.loadPixels();
        eye_mask.loadPixels();

        for (let i = 0; i < 45; i++) {
            eyeImages[i].loadPixels();
        }

        // Kelvinlet variables
        this.v = 0.5;
        this.a = 1 / (4 * PI * s.mu);
        this.b = this.a / (4 * (1 - this.v));

        // true-false picker flags between previousBust and videoBust -> for finalBust
        this.pickers = [];
        for (let i = 0; i < bust_default.height; i++) {
            this.pickers.push(Array(bust_default.width).fill(false));
        }

        // pre-compute list of eye pixel positions, for faster updates
        this.eyeImagePositions = []
        for (let i = 0; i < bust_default.pixels.length; i += 4) {
            if (eye_mask.pixels[i] || eye_mask.pixels[i + 1] || eye_mask.pixels[i + 2] || eye_mask.pixels[i + 3]) {
                this.eyeImagePositions.push(i);
            }
        }
    }

    draw() {
        push();

        translate((width*0.125), height/2 - (this.bust.height)*1.5)
        scale(1.5);
        imageMode(CORNER)
        image(this.bust, 0, 0)

        pop();
    }

    // updates finalBust's eye values to match current eyeImage (from cv_helper)
    updateEyes() {
        // go through precompute eye pixel positions
        for (let i = 0; i < this.eyeImagePositions.length; i++) {
            let curIndex = this.eyeImagePositions[i];
            this.colorPixel(curIndex, curIndex, true, eyeImages[eyeImageIndex].pixels);
        }
        this.bust.updatePixels();
    }
    

    melt(x0, f) {

        // populate pickers (setting to true means pixel from videoBuffer enters finalBuffer)
        for (let i = 0; i < p.pixelTransfer; i++) {
            this.pickers[floor(random(0, bust_default.height-1))][floor(random(0, bust_default.width-1))] = true;
        }

        // loop through all pixels in defaultMask
        for (let i = 0; i < bust_default.pixels.length; i += 4) {

            // get location of curPixel in defaultMask
            let curLoc = new Vec2((i/4) % bust_default.width, floor((i/4) / bust_default.width));

            // get curPixel's location within melted bust (using Kelvinlets)
            let r = curLoc.subtract(x0);
            let d = this.getKelvinlet(r, f);
            let newLoc = curLoc.add(d);

            // get newPixelLocation's index within defaultMask
            let final_i = int((d.getX() + d.getY() * bust_default.width))*4;
            final_i += i;

            // set values if within range
            if (newLoc.getX() >= 0 && newLoc.getX() < bust_default.width && newLoc.getY() >= 0 && newLoc.getY() < bust_default.height) {

                // if curPixel in eyeMask, color using current eye buffer
                if (eye_mask.pixels[i] || eye_mask.pixels[i + 1] || eye_mask.pixels[i + 2] || eye_mask.pixels[i + 3]) {
                    this.colorPixel(final_i, i, true, eyeImages[eyeImageIndex].pixels);
                } else {
                    // if curPixel in defaultMask, sample from buffer. else, background
                    if (bust_default.pixels[i] || bust_default.pixels[i + 1] || bust_default.pixels[i + 2] || bust_default.pixels[i + 3]) {
                        // if curPixel true in pickers, sample from videoBuffer. else, from previousBuffer
                        if (this.pickers[curLoc.getY()][curLoc.getX()]) {
                            this.colorPixel(final_i, i, true, videoBust.pixels);
                        } else {
                            this.colorPixel(final_i, i, true, previousBust.pixels);
                        }
                    } else {
                        this.colorPixel(final_i, i, false, 183);
                    }
                }
            }
        }

        this.bust.updatePixels();
    }
    
    // Section 4, 3D Regularized Kelvinlets, Equation 6 (https://graphics.pixar.com/library/Kelvinlets/paper.pdf)
    getKelvinlet(r, f) {
        let r_len = r.length2();
        let r_e = sqrt(r_len*r_len + s.epsilon*s.epsilon);
        let r_e_3 = r_e * r_e * r_e;
        
        let term1 = (this.a - this.b) / r_e;
        let term2 = this.b / (r_e_3);
        let term3 = (this.a / 2) * ((s.epsilon*s.epsilon)/r_e_3);
        
        let rrt = [r.scalarmult(r.getX()), r.scalarmult(r.getY())];
        
        rrt[0] = rrt[0].scalarmult(term2);
        rrt[1] = rrt[1].scalarmult(term2);
        
        rrt[0].setX(rrt[0].getX() + term1 + term3);
        rrt[1].setY(rrt[1].getY() + term1 + term3);
            
        return new Vec2(floor(rrt[0].dot(f)), floor(rrt[1].dot(f)));
    }

    // fills finalBust[i1] with val[i2], or simply val
    colorPixel(i1, i2, fromPixels, val) {
        for (let i = 0; i < 4; i++) {
            if (fromPixels) {
                this.bust.pixels[i1 + i] = val[i2 + i];
            } else if (i < 3) {
                this.bust.pixels[i1 + i] = val;
            }
        }
        if (!fromPixels) {
            this.bust.pixels[i1 + 3] = 255;
        }
    }

    // *** GETTERS / SETTERS ***

    resetPicker() {
        this.pickers = [];
        for (let i = 0; i < bust_default.height; i++) {
            this.pickers.push(Array(bust_default.width).fill(false));
        }
    }

    getPicker(i, j) {
        return this.pickers[i][j];
    }

    getPixels() {
        return this.bust.pixels;
    }
}
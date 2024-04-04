class MeltingBust {
    constructor() {
        this.bust = createGraphics(bust_default.width/2, bust_default.height/2, WEBGL);
        this.bust.setAttributes("alpha", true);
        // this.bust.loadPixels();
        bust_default.loadPixels();
        eye_hair_mask.loadPixels();
        bust_dynamic.loadPixels();
        bust_previous.loadPixels();
        eye_mask.loadPixels();

        for (let i = 0; i < 45; i++) {
            eyeMasks[i].loadPixels();
        }

        // print(this.bust.width, this.bust.height, bust_default.width, bust_default.height)

        // Kelvinlet variables
        this.v = 0.5;
        this.a = 1 / (4 * PI * s.mu);
        this.b = this.a / (4 * (1 - this.v));

        this.targetFace = 0;

        this.pickers = [];
        for (let i = 0; i < bust_default.height; i++) {
            this.pickers.push(Array(bust_default.width).fill(false));
        }

        // print(this.bust)
        this.eyeImagePositions = []
        for (let i = 0; i < bust_default.pixels.length; i += 4) {
            if (eye_mask.pixels[i] || eye_mask.pixels[i + 1] || eye_mask.pixels[i + 2] || eye_mask.pixels[i + 3]) {
                this.eyeImagePositions.push(i);
            }
        }
    }

    setTargetFace(targetFace) {
        if (!this.targetFace) {
        // print(this.setTargetFace)
        // // target face should be same size as default bust, should just crop video along bounding box
        this.targetFace = targetFace;
        // // print(this.targetFace)
        // this.targetFace.loadPixels();
        }
        // this.bust.clear();
    }

    getPixels() {
        // for (let i = 0; i < bust_default.pixels.length; i += 4) {
        //     if (!(bust_default.pixels[i] || bust_default.pixels[i + 1] || bust_default.pixels[i + 2] || bust_default.pixels[i + 3])) {
        //         this.bust.pixels[i] = 0;
        //         this.bust.pixels[i+1] = 0;
        //         this.bust.pixels[i+2] = 0;
        //         this.bust.pixels[i+3] = 0;
        //     }
        // }
        return this.bust.pixels;
    }

    draw() {
        push();

        // print(this.bust.pixels)
        translate((width*0.125), height/2 - (this.bust.height)*1.5)
        scale(1.5);
        // print(height, (-height/2 + height - this.bust.height) + this.bust.height)
        imageMode(CORNER)
        image(this.bust, 0, 0)

        pop();
    }

    resetPicker() {
        this.pickers = [];
        for (let i = 0; i < bust_default.height; i++) {
            this.pickers.push(Array(bust_default.width).fill(false));
        }
    }

    getPicker(i, j) {
        return this.pickers[i][j];
    }

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
            
        let final = new Vec2(floor(rrt[0].dot(f)), floor(rrt[1].dot(f)));
            
        return final;
    }

    countTrueElements(arr) {
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j] === true) {
                    count++;
                }
            }
        }
        return count;
    }

    fillEyes() {
        for (let i = 0; i < this.eyeImagePositions.length; i++) {
            let curIndex = this.eyeImagePositions[i];
            this.colorPixel(curIndex, curIndex, 1, true, eyeMasks[eyeMaskIndex].pixels);
        }
        this.bust.updatePixels();
    }

    melt(x0, f) {

        // if (shouldMelt) {

            for (let i = 0; i < 4000; i++) {
                // let ii = floor(random(0, bust_default.height-1))
                // let jj = floor(random(0, bust_default.width-1))
                // for (let iii = ii; iii < ii+15; iii++) {
                //     for (let jjj = jj; jjj < jj+15; jjj++) {
                //         if (iii < this.pickers.length && jjj < this.pickers[0].length) {
                //         this.pickers[iii][jjj] = true;
                //         }
                //     }
                // }
                this.pickers[floor(random(0, bust_default.height-1))][floor(random(0, bust_default.width-1))] = true;
            }
        // }

        // print(this.countTrueElements(this.pickers))

        let renderbackwards = false;
        let render_mult = renderbackwards ? -1 : 1;

        let max = bust_default.pixels.length;
        let min = 0;
        if (renderbackwards) {
            max = 0;
            min = bust_default.pixels.length - 1;
        }

        // print("eyemaskindex", eyeMaskIndex)

 
        for (let i = min; i < max; i += 4*render_mult) {

            // get location of curPixel (from bust_default)
            let curLoc = new Vec2((i/4) % bust_default.width, floor((i/4) / bust_default.width));

            // get curPixel's location within melted bust (using Kelvinlets)
            let r = curLoc.subtract(x0);
            let d = this.getKelvinlet(r, f);
            let newLoc = curLoc.add(d);

            // get newPixelLocation's index within graphics buffer
            let final_i = int((d.getX() + d.getY() * bust_default.width))*4;
            final_i += i;

            // set values if within range
            if (newLoc.getX() >= 0 && newLoc.getX() < bust_default.width && newLoc.getY() >= 0 && newLoc.getY() < bust_default.height) {

                // if (this.targetFace && !s.targetFace) {
                    if (eye_mask.pixels[i] || eye_mask.pixels[i + 1*render_mult] || eye_mask.pixels[i + 2*render_mult] || eye_mask.pixels[i + 3*render_mult]) {
                        this.colorPixel(final_i, i, render_mult, true, eyeMasks[eyeMaskIndex].pixels);
                    } else {
                        if (bust_default.pixels[i] || bust_default.pixels[i + 1*render_mult] || bust_default.pixels[i + 2*render_mult] || bust_default.pixels[i + 3*render_mult]) {
                            if (this.pickers[curLoc.getY()][curLoc.getX()]) {
                                this.colorPixel(final_i, i, render_mult, true, bust_dynamic.pixels);
                            } else {
                                this.colorPixel(final_i, i, render_mult, true, bust_previous.pixels);
                            }
                        } else {
                            this.colorPixel(final_i, i, render_mult, false, 183);
                        }
                    }
                // }
                // } else {
                //     if (bust_default.pixels[i] || bust_default.pixels[i + 1*render_mult] || bust_default.pixels[i + 2*render_mult] || bust_default.pixels[i + 3*render_mult]) {
                //         this.colorPixel(final_i, i, render_mult, true, bust_default.pixels);
                //     } else {
                //         this.colorPixel(final_i, i, render_mult, false, 183);
                //     }
                // }
            }
        }

        this.bust.updatePixels();
    }

    colorPixel(i1, i2, render_mult, fromPixels, val) {
        for (let i = 0; i < 4; i++) {
            if (fromPixels) {
                this.bust.pixels[i1 + i*render_mult] = val[i2 + i*render_mult];
            } else if (i < 3) {
                this.bust.pixels[i1 + i*render_mult] = val;
            }
        }
        if (!fromPixels) {
            this.bust.pixels[i1 + 3*render_mult] = 255;
        }
    }
}
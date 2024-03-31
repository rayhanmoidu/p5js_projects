class MeltingBust {
    constructor() {
        this.bust = createGraphics(bust_default.width/2, bust_default.height/2, WEBGL);
        this.bust.setAttributes("alpha", true);
        // this.bust.loadPixels();
        bust_default.loadPixels();
        eye_hair_mask.loadPixels();

        // print(this.bust.width, this.bust.height, bust_default.width, bust_default.height)

        // Kelvinlet variables
        this.v = 0.5;
        this.a = 1 / (4 * PI * s.mu);
        this.b = this.a / (4 * (1 - this.v));

        this.targetFace = 0;

        // print(this.bust)
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

    draw() {
        push();

        // print(this.bust.pixels)
        scale(2.5);
        image(this.bust, -width/2 + width*0.525, -height/2 + height*0.4)

        pop();
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

    melt(x0, f) {

        // this.bust.clear();

        // this.bust.updatePixels();
        // print(this.bust.height)

        // clear pixels
        // for (let i = 0; i < this.bust.pixels.length; i += 4) {
        //     this.bust.pixels[i] = 0;
        //     this.bust.pixels[i + 1] = 0;
        //     this.bust.pixels[i + 2] = 0;
        //     this.bust.pixels[i + 3] = 0;      
        // }

        // print(this.bust)

        // this.bust.background(255);

        // this.bust.clear();

        // set new pixel values

        let renderbackwards = false;
        let render_mult = renderbackwards ? -1 : 1;

        let max = bust_default.pixels.length;
        let min = 0;
        if (renderbackwards) {
            max = 0;
            min = bust_default.pixels.length - 1;
        }
 
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

            // print(bust_default.width, bust_default.height)

            // set values if within range
            if (newLoc.getX() >= 0 && newLoc.getX() < bust_default.width && newLoc.getY() >= 0 && newLoc.getY() < bust_default.height) {
                // print(bust_default.pixels[i])

                if (this.targetFace && !s.targetFace) {
                    // if (bust_default.pixels[i] && bust_default.pixels[i + 1*render_mult] && bust_default.pixels[i + 2*render_mult] && bust_default.pixels[i + 3*render_mult]) {
                    if (eye_hair_mask.pixels[i] && eye_hair_mask.pixels[i + 1*render_mult] && eye_hair_mask.pixels[i + 2*render_mult] && eye_hair_mask.pixels[i + 3*render_mult]) {
                        this.bust.pixels[final_i] = eye_hair_mask.pixels[i];
                        this.bust.pixels[final_i + 1*render_mult] = eye_hair_mask.pixels[i + 1*render_mult];
                        this.bust.pixels[final_i + 2*render_mult] = eye_hair_mask.pixels[i + 2*render_mult];
                        this.bust.pixels[final_i + 3*render_mult] = eye_hair_mask.pixels[i + 3*render_mult];
                    } else {
                        // if (bust_default.pixels[i] && bust_default.pixels[i + 1*render_mult] && bust_default.pixels[i + 2*render_mult] && bust_default.pixels[i + 3*render_mult]) {
                            // this.bust.pixels[final_i] = this.targetFace.pixels[i];
                            // this.bust.pixels[final_i + 1*render_mult] = this.targetFace.pixels[i + 1*render_mult];
                            // this.bust.pixels[final_i + 2*render_mult] = this.targetFace.pixels[i + 2*render_mult];
                            // this.bust.pixels[final_i + 3*render_mult] = this.targetFace.pixels[i + 3*render_mult];
                        // } else {
                            this.bust.pixels[final_i] = 183;
                            this.bust.pixels[final_i + 1*render_mult] = 183;
                            this.bust.pixels[final_i + 2*render_mult] = 183;
                            this.bust.pixels[final_i + 3*render_mult] = 255;
                        // }
                    }
                } else {
                    if (bust_default.pixels[i] && bust_default.pixels[i + 1*render_mult] && bust_default.pixels[i + 2*render_mult] && bust_default.pixels[i + 3*render_mult]) {
                        this.bust.pixels[final_i] = bust_default.pixels[i];
                        this.bust.pixels[final_i + 1*render_mult] = bust_default.pixels[i + 1*render_mult];
                        this.bust.pixels[final_i + 2*render_mult] = bust_default.pixels[i + 2*render_mult];
                        this.bust.pixels[final_i + 3*render_mult] = bust_default.pixels[i + 3*render_mult];
                    } else {
                        this.bust.pixels[final_i] = 183;
                        this.bust.pixels[final_i + 1*render_mult] = 183;
                        this.bust.pixels[final_i + 2*render_mult] = 183;
                        this.bust.pixels[final_i + 3*render_mult] = 255;
                    }
                }
            } else {
                // print("WHAT")
            }

        }

        // this.bust.clear();

        this.bust.updatePixels();
        // this.bust.clear();
    }
}
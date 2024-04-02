class CV_Helper {
    constructor() {
        this.rest_period = 0;
        this.begin_decrement = false;
        this.hasCapture = false;
        this.timeout = 0;

        this.targetEyeMask = -1;
    }

    recomputeOpticalFlow(preds) {
        let opticalFlow = 10;
        let singlepred;
        preds.forEach((pred, i) => {
            singlepred = pred;
            let curNosePos = new Vec2(pred.annotations["noseTip"][0][0], pred.annotations["noseTip"][0][1]);

            this.targetEyeMask = int(map(video.width - curNosePos.getX(), 0, video.width, 0, 44));
            this.targetEyeMask = max(0, this.targetEyeMask);
            this.targetEyeMask = min(44, this.targetEyeMask);

            let dir = this.targetEyeMask - eyeMaskIndex;

            eyeMaskIndex += dir * 0.5;
            eyeMaskIndex = int(eyeMaskIndex)

            // if (this.oldEyeMaskIndex != -1) {
            //     let temp = this.oldEyeMaskIndex;
            //     this.oldEyeMaskIndex = eyeMaskIndex;
            //     eyeMaskIndex = ceil((eyeMaskIndex + temp) / 2)
            // }


            if (prevNosePos) {
                let diff = curNosePos.subtract(prevNosePos).length2();
                opticalFlow = diff;
            }

            prevNosePos = curNosePos;
        })

        // melting logic
        let retVal = true;

        
        if (this.begin_decrement) { // bust is zooming back up
            if (this.rest_period <= 0) { // if finished
                this.timeout += 1;
                if (opticalFlow >= 3) {
                    this.timeout = 0;
                }
                retVal = false;
            } else {
                this.rest_period -= 0.4 * (this.rest_period);
                if (this.rest_period < 3) {
                    this.rest_period = 0;
                }
                this.rest_period = max(this.rest_period, 0);
                this.hasCapture = false;

                if (this.rest_period <= 0) {
                    this.timeout += 1;
                    retVal = false;
                }
            }
        } else {
            if (opticalFlow < 3) { 
                this.rest_period += 2;
                if (!this.hasCapture && singlepred) {
                    this.capture = this.captureFace(singlepred);
                    this.hasCapture = true;
                }
            } else {
                this.begin_decrement = true;
                this.timeout = 0;
            }
        }




        // if (opticalFlow < 3 && !this.begin_decrement) {
        //     this.rest_period += 2;
        //     if (!this.hasCapture && singlepred) {
        //         // print(singlepred)
        //         this.capture = this.captureFace(singlepred);
        //         this.hasCapture = true;
        //         // return true;
        //     }
        // } else {
        //     this.begin_decrement = true;
        //     this.rest_period -= 0.7 * (this.rest_period);
        //     if (this.rest_period < 3) {
        //         this.rest_period = 0;
        //     }
        //     this.rest_period = max(this.rest_period, 0);
        //     this.hasCapture = false;

        //     if (this.rest_period <= 0) {
        //         this.timeout += 1;
        //         // print("timeout", this.timeout)
        //         if (this.timeout > 1) {
        //             retVal = false;
        //         }
        //         // retVal = false;
        //     }
        // }

        // if (opticalFlow > 3) {
        //     this.timeout = 0;
        // }

        if (this.timeout > 250) {
            this.begin_decrement = false;
            this.timeout = 0;
            // retVal = false;
        }

        // print(retVal, this.timeout)

        // print(this.timeout, retVal)


        // if (this.rest_period > 500 && singlepred && this.noCapture) {
        //     print("CAPTURING")
        //     this.noCapture = false;
        //     this.capture = this.captureFace(singlepred);
        //     this.begin_decrement = true;
        //     return true;
        // }

        return retVal;
    }

    captureFace(p) {
        const bb = p.boundingBox;
        // get bb coordinates
        const x = bb.topLeft[0][0];
        const y = bb.topLeft[0][1];
        const w = bb.bottomRight[0][0] - x;
        const h = bb.bottomRight[0][1] - y;

        // print(x, y, w, h)

        // let capture = createImage(w, h);

        // // Load the image's pixels.
        // capture.loadPixels();

        // // Set the pixels to black.
        // for (let i = 0; i < capture.width; i += 1) {
        //     for (let j = 0; j < capture.height; j += 1) {
        //         capture.set(i, j, 255);
        //     }
        // }

        // // Update the image.
        // capture.updatePixels();
        video.loadPixels();
        // print(video.pixels)

        let pixel_w = s.imgW / w;
        let pixel_h = s.imgH / h;

        // print(x, y, w, h)

        let mincol = 1000000
        let minrow = 1000000
        let maxrow = -1
        let maxcol = -1

        let avgpp = 0;
        let nn = 0;

        lalala1 = []
        lalala2 = []

        let density = pixelDensity()
        // print("density", density)

        for (let i = 0; i < eye_hair_mask.pixels.length; i+=4) {
            if (!(eye_hair_mask.pixels[i] && eye_hair_mask.pixels[i + 1] && eye_hair_mask.pixels[i + 2] && eye_hair_mask.pixels[i + 3])) {
                if (bust_default.pixels[i] && bust_default.pixels[i + 1] && bust_default.pixels[i + 2] && bust_default.pixels[i + 3]) {

                    let row = (i/4) / (eye_hair_mask.width);
                    let col = (i/4) % (eye_hair_mask.width);
                    if (row > maxrow) {
                        maxrow = row
                    }
                    if (col > maxcol) {
                        maxcol = col
                    }
                    if (row < minrow) {
                        minrow = row
                    }
                    if (col < mincol) {
                        mincol = col
                    }


                    let boundingbox_samplerow = floor(map(row, 194, 684, h*0.2, h*0.8));
                    let boundingbox_samplecol = floor(map(col, 185, 557, w*0.2, w*0.8));

                    lalala1.push(y + boundingbox_samplerow)
                    lalala2.push(x + boundingbox_samplecol)

                    // print(x, y, w, h)

                    let bb_pixelpos = (floor(y) + boundingbox_samplerow)*video.width + (floor(x) + boundingbox_samplecol)

                    // let bb_pixelpos = floor((y+boundingbox_samplerow)*video.width + ((x+boundingbox_samplecol)));
                    avgpp += bb_pixelpos;
                    nn += 1;
                    // print("mod", bb_pixelpos % 4)
                    if (bb_pixelpos%4 != 0) {
                        // print("ERROR OMG")
                    }
                    // bb_pixelpos -= bb_pixelpos%4;

                    // print(bb_pixelpos)

                    let intensity = 0.299 * video.pixels[bb_pixelpos*4 + 0] + 0.587 * video.pixels[bb_pixelpos*4 + 1] + 0.114 * video.pixels[bb_pixelpos*4 + 2]
                    // intensity = 255 - intensity
                    // intensity += random(-50, 50);
                    
                    bust_dynamic.pixels[i] = intensity;
                    bust_dynamic.pixels[i + 1] = intensity;
                    bust_dynamic.pixels[i + 2] = intensity;
                    bust_dynamic.pixels[i + 3] = video.pixels[bb_pixelpos*4 + 3];
                    // need to take a section of the video feed
                    // eye_hair_mask.pixels[i] = 170;
                    // eye_hair_mask.pixels[i + 1] = 6;
                    // eye_hair_mask.pixels[i + 2] = 170;
                    // eye_hair_mask.pixels[i + 3] = 170;
                }
            }
        }

        lala1 = (avgpp / nn) / video.width;
        lala2 = (avgpp / nn) % video.width;

        // print("final", (avgpp / nn) / video.width, (avgpp / nn) % video.width);

        // print("final", minrow, maxrow, mincol, maxcol)

        // let capture = video.get(x, y, w, h);
        // capture.resize(s.imgW, s.imgH)
        // capture.filter(GRAY);

        // print("capture yay")
        // print("capture", this.rest_period, capture)

        return 100;
    }

    getFaceCapture() {
        let lala = this.capture;
        this.capture = 0;
        return lala;
    }

    getRestPeriod() {
        return this.rest_period;
    }
};
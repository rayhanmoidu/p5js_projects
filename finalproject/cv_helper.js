class CV_Helper {
    constructor() {
        this.rest_period = 0;
        this.begin_decrement = false;
        this.noCapture = true;
    }

    recomputeOpticalFlow(preds) {
        let opticalFlow = 0;
        let singlepred;
        preds.forEach((pred, i) => {
            singlepred = pred;
            let curNosePos = new Vec2(pred.annotations["noseTip"][0][0], pred.annotations["noseTip"][0][1]);

            if (prevNosePos) {
                let diff = curNosePos.subtract(prevNosePos).length2();
                opticalFlow = diff;
            }

            prevNosePos = curNosePos;
        })

        if (opticalFlow < 3 && !this.begin_decrement) {
            this.rest_period += 5;
        } else {
            this.begin_decrement = true;
            this.rest_period -= 150;
            this.rest_period = max(this.rest_period, 0);

            if (this.rest_period <= 0) {
                this.begin_decrement = false;
            }
        }


        if (this.rest_period > 500 && singlepred && this.noCapture) {
            print("CAPTURING")
            this.noCapture = false;
            this.capture = this.captureFace(singlepred);
            this.begin_decrement = true;
            return true;
        }

        return false;
    }

    captureFace(p) {
        const bb = p.boundingBox;
        // get bb coordinates
        const x = bb.topLeft[0][0];
        const y = bb.topLeft[0][1];
        const w = bb.bottomRight[0][0] - x;
        const h = bb.bottomRight[0][1] - y;

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
        print(video.pixels)

        let pixel_w = s.imgW / w;
        let pixel_h = s.imgH / h;

        print(x, y, w, h)

        let mincol = 1000000
        let minrow = 1000000
        let maxrow = -1
        let maxcol = -1

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


                    let boundingbox_samplerow = floor(map(row, 120, 435, 0, h));
                    let boundingbox_samplecol = floor(map(col, 120, 355, 0, w));

                    // print(x, y, w, h)

                    let bb_pixelpos = floor((y+boundingbox_samplerow)*video.width + ((x+boundingbox_samplecol)));

                    if (bb_pixelpos%4 != 0) {
                        // print("ERROR OMG")
                    }
                    bb_pixelpos -= bb_pixelpos%4;
                    // print(bb_pixelpos)

                    let intensity = 0.299 * video.pixels[bb_pixelpos*4 + 0] + 0.587 * video.pixels[bb_pixelpos*4 + 1] + 0.114 * video.pixels[bb_pixelpos*4 + 2]

                    intensity += random(-50, 50);
                    
                    eye_hair_mask.pixels[i] = intensity;
                    eye_hair_mask.pixels[i + 1] = intensity;
                    eye_hair_mask.pixels[i + 2] = intensity;
                    eye_hair_mask.pixels[i + 3] = video.pixels[bb_pixelpos*4 + 3];
                    // need to take a section of the video feed
                    // eye_hair_mask.pixels[i] = 170;
                    // eye_hair_mask.pixels[i + 1] = 6;
                    // eye_hair_mask.pixels[i + 2] = 170;
                    // eye_hair_mask.pixels[i + 3] = 170;
                }
            }
        }

        print("final", minrow, maxrow, mincol, maxcol)

        // let capture = video.get(x, y, w, h);
        // capture.resize(s.imgW, s.imgH)
        // capture.filter(GRAY);

        print("capture yay")
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
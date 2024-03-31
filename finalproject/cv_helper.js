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

        for (let i = 0; i < eye_hair_mask.pixels.length; i+=4) {
            if (!(eye_hair_mask.pixels[i] && eye_hair_mask.pixels[i + 1] && eye_hair_mask.pixels[i + 2] && eye_hair_mask.pixels[i + 3])) {
                if (bust_default.pixels[i] && bust_default.pixels[i + 1] && bust_default.pixels[i + 2] && bust_default.pixels[i + 3]) {
                    // need to take a section of the video feed
                    eye_hair_mask.pixels[i] = 170;
                    eye_hair_mask.pixels[i + 1] = 6;
                    eye_hair_mask.pixels[i + 2] = 170;
                    eye_hair_mask.pixels[i + 3] = 170;
                }
            }
        }

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
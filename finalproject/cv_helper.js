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

            let capture = video.get(x, y, w, h);
            capture.resize(s.imgW, s.imgH)
            capture.filter(GRAY);

            // print("capture", this.rest_period, capture)

            return capture;
    }

    getFaceCapture() {
        return this.capture;
    }

    getRestPeriod() {
        return this.rest_period;
    }
};
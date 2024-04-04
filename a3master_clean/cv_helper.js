class CV_Helper {
    constructor() {
        this.melting_force = 0;
        this.melting = true;
        this.nomelt_timeout = 0;

        this.hasCapture = false;

        this.eyeMaskIndex_target = -1;
    }

    recomputeOpticalFlow(preds) {

        let opticalFlow = 10; // default val of 10 satisfiable when no prediction
        let face_prediction;

        // loop through face predictions
        preds.forEach((pred) => {
            face_prediction = pred;

            // set index for eye image using user's nose position
            let curNosePos = new Vec2(pred.annotations["noseTip"][0][0], pred.annotations["noseTip"][0][1]);
            this.setEyeImageIndex(curNosePos);

            // compute optical flow
            if (prevNosePos) {
                opticalFlow = curNosePos.subtract(prevNosePos).length2();
            }
            prevNosePos = curNosePos;
        })
        
        return this.coordinateMelting(face_prediction, opticalFlow);
    }

    coordinateMelting(face_prediction, opticalFlow) {
        let shouldMelt = true;

        if (!this.melting) { // bust is not melting, currently in timeout period
            if (this.melting_force <= 0) { // bust in rest position
                // increase timeout
                this.nomelt_timeout += 1;

                // if motion, reset timeout
                if (opticalFlow >= 3) {
                    this.nomelt_timeout = 0;
                }
                shouldMelt = false;
            } else { // bust is snapping back up
                this.snapBack();
                this.hasCapture = false;

                // will execute when bust is finished snapping back up
                if (this.melting_force <= 0) {
                    this.nomelt_timeout += 1;
                    shouldMelt = false;
                }
            }
        } else { // bust is melting

            // user still at rest
            if (opticalFlow < 3) { 
                this.melting_force += 2; // increment melting force

                // take face from video feed
                if (!this.hasCapture && face_prediction) {
                    this.captureFace(face_prediction);
                    this.hasCapture = true;
                }
            } else { // user motion detected during melting -> stop melting and restart timeout
                this.melting = false;
                this.nomelt_timeout = 0;
            }
        }

        // if timeout complete, begin melting
        if (this.nomelt_timeout > 250) {
            this.melting = true;
            this.nomelt_timeout = 0;
        }
        return shouldMelt;
    }

    captureFace(p) {

        // get prediction's bounding box coords
        const bb = p.boundingBox;
        const x = bb.topLeft[0][0];
        const y = bb.topLeft[0][1];
        const w = bb.bottomRight[0][0] - x;
        const h = bb.bottomRight[0][1] - y;

        video.loadPixels();

        // offset video pixel intensity by random val, so successive captures are slightly different
        let intensityoffset = random(25, 75);

        // go through all pixels in mask
        for (let i = 0; i < eye_hair_mask.pixels.length; i+=4) {

            // color pixel if in defaultMask, and not in EHEMask
            if (!(eye_hair_mask.pixels[i] && eye_hair_mask.pixels[i + 1] && eye_hair_mask.pixels[i + 2] && eye_hair_mask.pixels[i + 3])) {
                if (bust_default.pixels[i] && bust_default.pixels[i + 1] && bust_default.pixels[i + 2] && bust_default.pixels[i + 3]) {

                    // get position of pixel in mask
                    let row = (i/4) / (eye_hair_mask.width);
                    let col = (i/4) % (eye_hair_mask.width);

                    // map pixel position from mask to prediction's bb coords
                    let boundingbox_samplerow = floor(map(row, 194, 684, h*0.2, h*0.8));
                    let boundingbox_samplecol = floor(map(col, 185, 557, w*0.2, w*0.8));

                    // get pixel index from coords
                    let bb_pixelind = (floor(y) + boundingbox_samplerow)*video.width + (floor(x) + boundingbox_samplecol)

                    // set intensity from rgb, and add offset
                    let intensity = 0.299 * video.pixels[bb_pixelind*4 + 0] + 0.587 * video.pixels[bb_pixelind*4 + 1] + 0.114 * video.pixels[bb_pixelind*4 + 2]
                    intensity += intensityoffset;
                    intensity = min(255, intensity)
                    
                    // fill videoBuffer
                    bust_dynamic.pixels[i] = intensity;
                    bust_dynamic.pixels[i + 1] = intensity;
                    bust_dynamic.pixels[i + 2] = intensity;
                    bust_dynamic.pixels[i + 3] = video.pixels[bb_pixelind*4 + 3];
                }
            }
        }
    }

    // reduces melting force to 0, scaling by itself (non-linear motion)
    snapBack() {
        this.melting_force -= 0.4 * (this.melting_force);
        if (this.melting_force < 3) { // floor once hit 3
            this.melting_force = 0;
        }
        this.melting_force = max(this.melting_force, 0);
    }

    // sets eyeImageIndex = [0, 44] based on nosePos.x within video width
    setEyeImageIndex(curNosePos) {
        this.targetEyeMask = int(map(video.width - curNosePos.getX(), 0, video.width, 0, 44));
        this.targetEyeMask = max(0, this.targetEyeMask);
        this.targetEyeMask = min(44, this.targetEyeMask);

        let dir = this.targetEyeMask - eyeMaskIndex;

        eyeMaskIndex += dir * 0.5;
        eyeMaskIndex = int(eyeMaskIndex)
    }

    getMeltingForce() {
        return this.melting_force;
    }
};
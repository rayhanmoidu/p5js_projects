class CV_Helper {
    constructor() {
    }

    getOpticalFlow(preds) {
        // if insufficient previous states, resize array and return 0 
        if (prevNosePos.length != preds.length) {
            prevNosePos = [];
            for (let i = 0; i < preds.length; i++) {
                prevNosePos.push(new Vec3(preds[i].pose["nose"].x, preds[i].pose["nose"].y, 0))
            }
            return 0;
        }
        
        // if numPreds and numPrevStates are same, find correspondances to compute optical flow
        let maxOpticalFlow = 0;
        let curNosePositions = [];
        preds.forEach((pred, i) => {
            let curNosePos = new Vec3(pred.pose["nose"].x, pred.pose["nose"].y, 0);
            curNosePositions.push(curNosePos);

            // for curPrediction, find closest prevNosePos
            let closest_dist = 10000000;
            let closest_ind = -1;
            for (let j = 0; j < prevNosePos.length; j++) {
                let diff = curNosePos.subtract(prevNosePos[j]).length2();
                if (diff < closest_dist) {
                    closest_dist = diff;
                    closest_ind = j;
                }
            }

            // save highest "closest prevNosePos" as optical flow
            if (closest_dist > maxOpticalFlow && closest_ind != -1) {
                maxOpticalFlow = closest_dist;
            }
        })

        // when done computation, save cur positions in prev state var
        for (let i = 0; i < prevNosePos.length; i++) {
            prevNosePos[i] = curNosePositions[i];
        }

        return maxOpticalFlow;
    }

    recomputeLightPositions() {

        // only take predictions above confidence threshold
        let numPredictions = 0;
        let actualPredictions = [];
      
        for (let i = 0; i < predictions.length; i++) {
          if (predictions[i].pose["score"] > p.confidence) {
            numPredictions += 1;
            actualPredictions.push(predictions[i]);
          }
        }

        // get optical flow
        opticalFlow = this.getOpticalFlow(actualPredictions);
        
        // size light source array to match numPredictions
        if (lightSources.length > numPredictions) {
            lightSources = lightSources.slice(0, numPredictions);
        } else if (lightSources.length < numPredictions) {
          for (let i = 0; i < numPredictions-lightSources.length; i++) {
            lightSources.push(new Vec3(0, 0, 0));
          }
        }
        
        // adjust light source positions based on new body predictions
        actualPredictions.forEach((pred, i) => {
          let leftShoulder = pred.pose["leftShoulder"];
          let rightShoulder = pred.pose["rightShoulder"];
      
          if (leftShoulder.x && rightShoulder.x && leftShoulder.y && rightShoulder.y) {
            let middlePosX = (leftShoulder.x + rightShoulder.x) / 2;
            let middlePosY = (leftShoulder.y + rightShoulder.y) / 2;
      
            lightSources[i].setX(width - middlePosX*widthScaleFactor);
            lightSources[i].setY(middlePosY*heightScaleFactor);
      
            let xDiff = abs(leftShoulder.x - rightShoulder.x);
            shoulderWidth = xDiff; // debug var
            xDiff = min(120, xDiff);
            xDiff = max(50, xDiff);
      
            lightSources[i].setZ(int(p.zDepth) - map(xDiff, 50, 120, 0, int(p.zDepth)));
          }
        })
      }
};
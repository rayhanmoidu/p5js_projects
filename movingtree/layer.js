function compareSprings(a, b) {
    return b.getLevel() - a.getLevel();
}

class Layer {
    constructor(h, z, treevals) {
        this.layerId = layerId++;
        this.z = z;
        this.groundHeight = h;
        let threshold = 100;
        this.peak = random(0 + threshold, canvasw - threshold);

        let tol = 200;

        let charTol = 300;

        let side = random(-1, 1);
        let characterX = random(0-charTol, canvasw+charTol);

        if (side > 0) {
            characterX = random(0-charTol, this.peak - tol);
        } else {
            characterX = random(this.peak + tol, canvasw+charTol);
        }

        let characterY;
        if (characterX < this.peak) {
            characterY = random(0, (this.groundHeight/this.peak)*characterX);
        } else {
            characterY = random(0, (this.groundHeight/(canvasw-this.peak))*(canvasw - characterX));
        }

        let characterHeight = p.dressHeight + 50;


        let angleOffset = random(0.1, 1.4);
        let numLevels = round(random(7, 10));
        let treeHeight = random(250, 400);
        let branchLength = random(50, 150);
        let branchLengthFactor = random(0.75, 1);

        this.tree = new Tree("basicFractal", treevals.angleOffset, this.peak, canvash - this.groundHeight, treevals.numLevels, 2, treevals.treeHeight, treevals.branchLength, treevals.branchLengthFactor, 3000, 0.8);
        this.character = new Character(new Vec2(characterX, canvash - characterY - characterHeight), 1); // 0.75 for mass

        this.simulation = new Simulation(this.tree.getSprings().concat(this.character.getSprings()), this.tree.getParticles().concat(this.character.getParticles()), 0.25);
    }

    update() {
        this.z -= zSpeed;
        let windf = 1000 * noise(this.simulation.getTime());
        let windForce = new Vec2(windf,  0);
        let gravitationalForce = new Vec2(0,  90.81);
        this.simulation.addExternalForce("wind", windForce);
        this.simulation.addExternalForce("gravity", gravitationalForce);

        this.simulation.update(this.z);
        this.simulation.resetExternalForces();
    }

    render() {
        if (this.z <= zSpeed) {
            // stopanim = true;
            const index = visibleLayers.indexOf(this);
            if (index > -1) { // only splice array when item is found
                visibleLayers.splice(index, 1); // 2nd parameter means remove one item only
            }
        }

        push();
        noStroke();
        let colorFactor = (((this.z) / cubeDepth) * 0.2) + 0.8;
        let opacity = 255 * ((cubeDepth - this.z) / cubeDepth);
        // fill(106*colorFactor, 158*colorFactor, 98*colorFactor)
        fill(125*colorFactor, 186*colorFactor, 115*colorFactor)
        // fill(102, 145, 96)

        let shiftx = ((canvasw - (canvasw * (1/cubeDepth))) / 2)
        let shifty = (canvash - (canvash * (1/this.z))) * (1 - (this.groundHeight / canvash))
        let shifty2 = (canvash - (canvash * (1/this.z))) / 2
        let leftover = (canvash - (canvash * (1/100))) * (1 - (this.groundHeight / canvash)) + (canvash * (1/100));
        leftover = canvash - leftover;

        translate(shiftx, shifty)
        scale(1/this.z)

        // hill
        beginShape();
        curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        curveVertex(this.peak, canvash - this.groundHeight)
        curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
        curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
        curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
        curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        endShape();

        // beginShape();
        // curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        // curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
        // curveVertex(this.peak, canvash - this.groundHeight + 1)
        // curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
        // curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
        // endShape();

        // tree
        this.tree.render();

        // character
        this.character.render(this.z, this.groundHeight);

        // white overlay
        scale(this.z)
        translate(-shiftx, -shifty)
        noStroke();
        // if (s.presentMode) {
        // fill(255, 217, 250, 255-opacity);
        // } else {
        fill(255, 235, 252, 255-opacity);
        // }
        // fill(255, 235, 253, 255-opacity);
        rect(0, 0, canvasw, canvash);

        pop();
    }
}
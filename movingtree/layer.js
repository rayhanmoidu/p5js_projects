function compareSprings(a, b) {
    return b.getLevel() - a.getLevel();
}

class Layer {
    constructor(h, z) {
        this.z = z;
        this.groundHeight = h;
        let threshold = 100;
        this.peak = random(0 + threshold, canvasw - threshold);

        let tol = 200;

        let side = random(-1, 1);
        let characterX = random(0, canvasw);

        if (side > 0) {
            characterX = random(0, this.peak - tol);
        } else {
            characterX = random(this.peak + tol, canvasw);
        }

        let characterY;
        if (characterX < this.peak) {
            characterY = random(0, (this.groundHeight/this.peak)*characterX);
        } else {
            characterY = random(0, (this.groundHeight/(canvasw-this.peak))*(canvasw - characterX));
        }

        let characterHeight = p.dressHeight + 50 + 50;


        this.tree = new Tree("basicFractal", p.angleOffset, this.peak, canvash - this.groundHeight, p.numLevels, p.branchingFactor, p.treeHeight, p.branchLength, p.branchLengthFactor, p.mass, p.massFactor);
        this.character = new Character(new Vec2(characterX, canvash - characterY - characterHeight), 1); // 0.75 for mass

        this.simulation = new Simulation(this.tree.getSprings().concat(this.character.getSprings()), this.tree.getParticles().concat(this.character.getParticles()), 10 / frameRate());
    }

    update() {
        this.z -= p.speed;
        let windForce = new Vec2(p.windForce,  0);
        let gravitationalForce = new Vec2(0,  90.81);
        this.simulation.addExternalForce("wind", windForce);
        this.simulation.addExternalForce("gravity", gravitationalForce);

        this.simulation.update();
        this.simulation.resetExternalForces();
    }

    render() {
        if (this.z <= p.speed) {
            // stopanim = true;
            const index = visibleLayers.indexOf(this);
            if (index > -1) { // only splice array when item is found
                visibleLayers.splice(index, 1); // 2nd parameter means remove one item only
            }
        }

        push();
        noStroke();
        let colorFactor = (((this.z) / p.cubeDepth) * 0.2) + 0.8;
        let opacity = 255 * ((p.cubeDepth - this.z) / p.cubeDepth);
        fill(125*colorFactor, 186*colorFactor, 115*colorFactor)

        let shiftx = ((canvasw - (canvasw * (1/100))) / 2)
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
        curveVertex(this.peak, canvash - this.groundHeight)
        curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
        curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
        endShape();

        // tree
        this.tree.render();

        // character
        this.character.render();

        // white overlay
        scale(this.z)
        translate(-shiftx, -shifty)
        noStroke();
        fill(255, 235, 253, 255-opacity);
        rect(0, 0, canvasw, canvash);

        pop();
    }
}
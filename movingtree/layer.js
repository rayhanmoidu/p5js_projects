function compareSprings(a, b) {
    return b.getLevel() - a.getLevel();
}

class Layer {
    constructor(h, z) {
        this.z = z;
        this.groundHeight = h;
        let threshold = 100;
        this.peak = random(0 + threshold, canvasw - threshold);

        this.tree = new Tree("basicFractal", p.angleOffset, this.peak, canvash - this.groundHeight, p.numLevels, p.branchingFactor, p.treeHeight, p.branchLength, p.branchLengthFactor, p.mass, p.massFactor);
        this.character = new Character(new Vec2(300, 100), 1); // 0.75 for mass

        this.simulation = new Simulation(this.tree.getSprings().concat(this.character.getSprings()), this.tree.getParticles().concat(this.character.getParticles()), 0.5);
    }

    update() {
        this.z -= p.speed;
        // let externalForce = new Vec2(random(-p.force, p.force), random(-p.force))
        let externalForce = new Vec2(p.windForce,  9.81);
        this.simulation.addExternalForce(externalForce);
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
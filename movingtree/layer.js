function compareSprings(a, b) {
    return b.getLevel() - a.getLevel();
}

class Layer {
    constructor(h, z) {
        this.z = z;
        this.groundHeight = h;
        let threshold = 100;
        this.peak = random(0 + threshold, canvasw - threshold);

        this.tree = new Tree("basicFractal", p.angleOffset, this.peak, canvash - this.groundHeight, p.numLevels, p.branchingFactor, p.treeHeight, p.branchLength, p.branchLengthFactor, p.mass, p.massFactor); // 0.75 for mass
        this.simulation = new Simulation(this.tree.getSprings(), this.tree.getParticles(), 5);
    }

    update() {
        this.z -= p.speed;
        let externalForce = new Vec2(random(-p.force, p.force), random(-p.force))
        this.simulation.addExternalForce(externalForce.scalarmult(random(0, 1)));
        this.simulation.update();
        this.simulation.resetExternalForces();
    }

         

    render(fullOpacity) {
        if (this.z <= p.speed) {
            // stopanim = true;
            const index = visibleLayers.indexOf(this);
            if (index > -1) { // only splice array when item is found
                visibleLayers.splice(index, 1); // 2nd parameter means remove one item only
            }
        }

            push();
            noStroke();
            let colorFactor = (((this.z) / cubeDepth) * 0.2) + 0.8;
            let opacity = fullOpacity ? 255 : 255 * ((cubeDepth - this.z) / cubeDepth);
            fill(125*colorFactor, 186*colorFactor, 115*colorFactor, opacity)
            // fill(107, 179, 104, 255 * ((cubeDepth - this.z) / cubeDepth));
            // translate(0, canvash/2);
            // if (this.z < 5) {
            //     if (this.z == 2)
            //         stopanim = true;
            // }
            // scale(1/this.z)

            let shiftx = ((canvasw - (canvasw * (1/100))) / 2)
            let shifty = (canvash - (canvash * (1/this.z))) * (1 - (this.groundHeight / canvash))
            let shifty2 = (canvash - (canvash * (1/this.z))) / 2
            let leftover = (canvash - (canvash * (1/100))) * (1 - (this.groundHeight / canvash)) + (canvash * (1/100));
            leftover = canvash - leftover;

            translate(shiftx, shifty)
            

            scale(1/this.z)

            beginShape();
            curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
            curveVertex(0 - shiftx*this.z, canvash + leftover*this.z)
            curveVertex(this.peak, canvash - this.groundHeight)
            curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
            curveVertex(canvasw + shiftx*this.z, canvash + leftover*this.z)
            endShape();

            let springs = this.simulation.getSprings();
            springs.sort(compareSprings)
            for (let i = 0; i < springs.length; i++) {
                let endpoints = springs[i].getEndpoints();
                strokeWeight(springs[i].getLevel());
                stroke((12-springs[i].getLevel())/12 * 50, opacity)
                line(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), endpoints[1].getPos().getX(), endpoints[1].getPos().getY())
            }

            for (let i = 0; i < springs.length; i++) {
                if (springs[i].getLevel()==1) {
                    let endpoints = springs[i].getEndpoints();
                    fill(83, 130, 65, opacity)
                    stroke(83, 130, 65, opacity)
                    circle(endpoints[1].getPos().getX(), endpoints[1].getPos().getY(), 6);
                    stroke(0)
                }
            }


            // fill(255, 0, 0, opacity)
            // ellipse(this.peak, canvash - this.groundHeight, 500, 500);

            // fill(255, 0, 0)
            // ellipse(this.peak, this.groundHeight, 50, 50);
            pop();
        
    }
}
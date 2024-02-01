class Layer {
    constructor(h, z, treevals) {
        this.layerId = layerId++;

        // depth
        this.z = z;

        // peak of hill
        this.peakX = random(0 + p.peakThresholdX, canvasw - p.peakThresholdX);
        this.peakY = h;

        // character
        let characterPos = this.getCharacterPos();
        let characterHeight = p.dressHeight + p.headRadius*2;
        
        // create objects for tree and character
        this.tree = new Tree(treevals.angleOffset, this.peakX, canvash - this.peakY, treevals.numLevels, p.branchingFactor, treevals.treeHeight, treevals.branchLength, treevals.branchLengthFactor, p.treeMass, p.treeMassFactor);
        this.character = new Character(new Vec2(characterPos.x, canvash - characterPos.y - characterHeight), 1);

        // create simulation engine, running over all springs modelling tree and character 
        this.simulation = new Simulation(this.tree.getSprings().concat(this.character.getSprings()), this.tree.getParticles().concat(this.character.getParticles()), p.simulationTimestep);
    }

    update() {
        this.z -= s.speed;

        // add forces
        let windf = p.windForce * noise(this.simulation.getTime());
        let windForce = new Vec2(windf,  0);
        let gravitationalForce = new Vec2(0,  90.81);
        this.simulation.addExternalForce(windForce);
        this.simulation.addExternalForce(gravitationalForce);

        // update particle positions and reset forces
        this.simulation.update(this.z);
        this.simulation.resetExternalForces();
    }

    render() {
        // once layer is in front of camera, remove from list of visible layers
        if (this.z <= s.speed) {
            const index = visibleLayers.indexOf(this);
            if (index > -1) {
                visibleLayers.splice(index, 1);
            }
        }

        // factors based on z value
        let colorFactor = (((this.z) / p.cubeDepth) * 0.2) + 0.8;
        let opacity = 255 * ((this.z) / p.cubeDepth);

        // ***** to visualize depth, scale and translate based on z-value before rendering *****
        // translateX: middle of canvas, translateY: lower-half of canvas (based on peakY)
        let shiftx = ((canvasw - (canvasw * (1/p.cubeDepth))) / 2)
        let shifty = (canvash - (canvash * (1/this.z))) * (1 - (this.peakY / canvash))

        // extend hill dimensions to fill screen despite frame being scaled
        let hillExtension = canvash - ((canvash - (canvash * (1/100))) * (1 - (this.peakY / canvash)) + (canvash * (1/100)));

        // start rendering
        push();

        fill(125*colorFactor, 186*colorFactor, 115*colorFactor);
        noStroke();

        translate(shiftx, shifty)
        scale(1/this.z)

        // hill
        beginShape();
        curveVertex(0 - shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(0 - shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(0 - shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(this.peakX, canvash - this.peakY)
        curveVertex(canvasw + shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(canvasw + shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(canvasw + shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(0 - shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(0 - shiftx*this.z, canvash + hillExtension*this.z)
        curveVertex(0 - shiftx*this.z, canvash + hillExtension*this.z)
        endShape();

        // tree
        this.tree.render();

        // character
        this.character.render(this.z);

        // white overlay (covers entire screen)
        scale(this.z)
        translate(-shiftx, -shifty)

        noStroke();
        fill(255, 235, 252, opacity);
        rect(0, 0, canvasw, canvash);

        pop();
    }

    getCharacterPos() {        
        let side = random(-1, 1);

        // randomize xPos, keeping a distance from the tree
        let characterX = 0;
        if (side > 0) {
            characterX = random(0-p.characterTolerance_extra, this.peakX - p.characterTolerance_tree);
        } else {
            characterX = random(this.peakX + p.characterTolerance_tree, canvasw+p.characterTolerance_extra);
        }

        // randomize yPos, ensuring character is positioned on hill
        let characterY;
        if (characterX < this.peakX) {
            characterY = random(0, (this.peakY/this.peakX)*characterX);
        } else {
            characterY = random(0, (this.peakY/(canvasw-this.peakX))*(canvasw - characterX));
        }

        return {"x": characterX, "y": characterY};
    }
}
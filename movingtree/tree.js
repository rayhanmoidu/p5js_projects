function compareSprings(a, b) {
    return b.getLevel() - a.getLevel();
}

class Tree {
    // Tree is modelled as an out-stretching network of springs

    constructor(angleOffset, xPos, yPos, fractalFactor, branchingFactor, treeHeight, branchLength, branchLengthScalingFactor, startingMass, massScalingFactor) {
        // springs and particles defining tree
        this.springs = [];
        this.particles = [];
        // IDs of particles that do not undergo motion
        this.fixedIds = [];

        this.fractalFactor = fractalFactor;

        this.setupTree(xPos, yPos, angleOffset, fractalFactor, branchingFactor, treeHeight, branchLength, branchLengthScalingFactor, startingMass, massScalingFactor);
        
        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    setupTree(xPos, yPos, angleOffset, fractalFactor, branchingFactor, treeHeight, branchLength, branchLengthScalingFactor, startingMass, massScalingFactor) {
        let springs = [];
        let particles = [];

        // create particles and spring for tree trunk
        let se1 = new SpringEndpoint(0, "tree", new Vec2(xPos, yPos), startingMass, fractalFactor+1);
        let se2 = new SpringEndpoint(1, "tree", new Vec2(xPos, yPos - treeHeight), startingMass, fractalFactor+1);
        let spr1 = new Spring(0, se1, se2, treeHeight, p.springKs, p.springKd, fractalFactor+1);
        particles.push(se1);
        particles.push(se2);
        springs.push(spr1);

        // recursively create tree branches
        this.fractalHelper(fractalFactor, angleOffset, branchingFactor, se2, se1, branchLength, branchLengthScalingFactor, springs, particles, startingMass, massScalingFactor);
        
        this.springs = springs;
        this.particles = particles;
        this.fixedIds = [0, 1]; // trunk particles are fixed
    }

    fractalHelper(curLevel, angleOffset, branchingFactor, stem_endpoint, stem_connectingendpoint, branchLength, branchLengthScalingFactor, springs, particles, mass, massScalingFactor) {
        if (curLevel==0) { // fractalFactor is hit in recursive stack
            return;
        }

        // compute angle used to deviate branch direction 
        let angleToDiv = PI - 2*angleOffset
        let thetaDiff = (angleToDiv / (branchingFactor+1));

        // create n branches, n defined as tree parameter
        for (let i = 0; i < branchingFactor; i++) {

            // compute angle deviation for curBranch
            let stemTheta = atan((stem_connectingendpoint.getPos().getX() - stem_endpoint.getPos().getX()) / (stem_connectingendpoint.getPos().getY() - stem_endpoint.getPos().getY()));
            let sign2 = (stem_endpoint.getPos().getY() - stem_connectingendpoint.getPos().getY()) / abs(stem_endpoint.getPos().getY() - stem_connectingendpoint.getPos().getY())
            if (sign2 > 0) {
                stemTheta += PI;
            }

            // find curBranch's new/extended endpoint
            let diffx = branchLength * cos(angleOffset + thetaDiff * (i+1) + stemTheta);
            let diffy = branchLength * sin(angleOffset + thetaDiff * (i+1) + stemTheta);

            // create new particle and spring for curBranch
            let new_endpoint = new SpringEndpoint(particles.length, "tree", new Vec2(stem_endpoint.getPos().getX() + diffx, stem_endpoint.getPos().getY() - diffy), mass, curLevel);
            let new_spring = new Spring(springs.length, stem_endpoint, new_endpoint, branchLength, p.springKs, p.springKd, curLevel);
            particles.push(new_endpoint);
            springs.push(new_spring);

            // recursively create branches stemming from curBranch's new/extended endpoint
            this.fractalHelper(curLevel-1, angleOffset, branchingFactor, new_endpoint, stem_endpoint, branchLength*branchLengthScalingFactor, branchLengthScalingFactor, springs, particles, mass*massScalingFactor, massScalingFactor);
        }
    }

    render() {
        push();

        // each spring either represents a tree branch or the tree trunk
        let springs = this.springs.sort(compareSprings)

        // render all springs as lines, weighted by branchLevel (depth in recursive stack during creation)
        for (let i = 0; i < springs.length; i++) {
            let endpoints = springs[i].getEndpoints();
            strokeWeight(springs[i].getLevel());
            stroke(((this.fractalFactor+1)-springs[i].getLevel())/(this.fractalFactor+1) * 50)
            line(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), endpoints[1].getPos().getX(), endpoints[1].getPos().getY())
        }

        // render leaves on childless branches. Separate pass so leaves render on top of branches
        for (let i = 0; i < springs.length; i++) {
            if (springs[i].getLevel()==1) {
                let endpoints = springs[i].getEndpoints();
                fill(83, 130, 65)
                stroke(83, 130, 65)
                circle(endpoints[1].getPos().getX(), endpoints[1].getPos().getY(), p.leafRadius);
                stroke(0)
            }
        }

        pop();
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }
}
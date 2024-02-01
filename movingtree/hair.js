class Hair {
    // hair is modelled as collection of strands, each of which is a line of connected springs

    constructor(pos, headR) {
        // springs and particles defining all strands
        this.springs = [];
        this.particles = [];
        // IDs of particles that do not undergo motion
        this.fixedIds = [];

        this.numStrandsCreated = 0;

        // randomized hair parameters
        this.springsPerStrand = round(random(p.springsPerStrand_min, p.springsPerStrand_max));
        let strandLength = random(p.strandLength_min, p.strandLength_max);
        this.springLength = strandLength / this.springsPerStrand;
        this.lineWeightDivisions = round(random(p.lineWeightDivisions_min, p.lineWeightDivisions_max));
        this.curveThreshold = random(p.curveThreshold_min, p.curveThreshold_max);
        this.numStrands = round(random(p.numStrands_min, p.numStrands_max));
        let rootWidthMultiplier = (this.curveThreshold*this.numStrands)/(p.curveThreshold_max*p.numStrands_max);
        this.rootWidth = p.rootWidth_max * (1-rootWidthMultiplier);        

        this.setupHair(pos, headR);

        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    createStrand(startPos, idOffset, headPos) {
        let headWidth = p.headRadius - (startPos.getX() - headPos.getX());

        // adjust mass of strand by random factor (so each strand on head has deviation)
        let randomFact = random(p.hairMassRandomFactor_lower, p.hairMassRandomFactor_upper);

        // create particles and spring fixed on character head
        let newEndpoint1 = new SpringEndpoint(idOffset, "hair", new Vec2(startPos.getX(), startPos.getY()), p.hairMass*randomFact, this.springsPerStrand);
        let newEndpoint2 = new SpringEndpoint(idOffset + 1, "hair", new Vec2(startPos.getX() + headWidth, startPos.getY()), p.hairMass*randomFact, this.springsPerStrand - 1);
        let newSpring = new Spring(idOffset, newEndpoint2, newEndpoint1, headWidth, p.springKs, p.springKd, this.springsPerStrand);
        this.particles.push(newEndpoint1);
        this.particles.push(newEndpoint2);
        this.springs.push(newSpring);

        // create remaining particles and springs along x-axis to complete strand
        for (let i = 1; i < this.springsPerStrand-1; i++) {
            let xPos = startPos.getX() + headWidth + i*this.springLength;

            let newEndpoint = new SpringEndpoint(idOffset + i + 1, "hair", new Vec2(xPos, startPos.getY()), p.hairMass*randomFact*i*p.hairMassFactor, this.springsPerStrand - (i+1));
            let neighbourEndpoint = this.particles[this.particles.length - 1];
            let newSpring = new Spring(idOffset + i, newEndpoint, neighbourEndpoint, this.springLength, p.springKs, p.springKd, this.springsPerStrand - (i+1));
            
            this.springs.push(newSpring);
            this.particles.push(newEndpoint);
        }

        // particles on head remain fixed
        this.fixedIds.push(idOffset)
        this.fixedIds.push(idOffset+1)
    }

    setupHair(pos, headR) {
        // take bounding box of character head's upper half, and rotate by 45 degrees clockwise
        // iterate through n evenly-spaced points within bounding box, and create strands (n is defined as randomized hair parameter)

        // find dimensions of bounding box
        let diry = new Vec2(0.5, -0.5);
        let dirx = new Vec2(0.5, 0.5);

        let totalArea = headR*headR*2;
        let dim = sqrt(totalArea/this.numStrands);

        let startPos = pos.add(new Vec2(0, -p.headRadius*sqrt(2)));

        // iterate through bounding box
        for (let i = 0; i < round(headR*3 / dim); i++) {
            for (let j = 0; j < round(headR*1.5 / dim); j++) {
                // find curPos within bounding box
                let shiftx = dirx.scalarmult(i*dim);
                let shifty = diry.scalarmult(-j*dim);
                let strandPos = startPos.add(shiftx).add(shifty);

                // if curPos lies on character head, create strand
                if (pos.subtract(strandPos).length2() < headR) {
                    this.createStrand(strandPos, this.numStrandsCreated*this.springsPerStrand, pos);
                    this.numStrandsCreated ++;
                }
            }
        }
    }

    render() {
        push();

        // springs representing all strands
        let springs = this.springs;

        // iterate through springs
        for (let i = 0; i < springs.length; i++) {
            let endpoints = springs[i].getEndpoints();

            // divide spring into individual segments to get better strokeWeight gradient
            // idea: instead of distributing strokeWeight across n springs, distribute across n*m spring segments
            let diff = endpoints[1].getPos().subtract(endpoints[0].getPos());
            let dist = diff.length2();
            diff = diff.scalarmult(1/dist); 
            let spacing = dist / this.lineWeightDivisions; // represents length of each curSpring's segments

            // iterate through curSpring's segments
            for (let j = 0; j < this.lineWeightDivisions; j++) {
                // get strokeWeight of curSegment based on 1) spring position within strand, 2) segment position within spring
                let weight = this.rootWidth*(springs[i].getLevel()/(this.springsPerStrand*2)) + (j*(1/this.lineWeightDivisions));
                strokeWeight(weight);
                stroke(0);

                // get positions of curSegment
                let pos1 = endpoints[0].getPos().add(diff.scalarmult(spacing*j));
                let pos2 = endpoints[0].getPos().add(diff.scalarmult(spacing*(j+1)));

                // instead of rendering curSegment as line, render as curve
                // compute tangent information for curSegment based on 1) spring position within strand, 2) segment position within spring
                let cp1, cp2;

                let shouldSpringStartMatch = false;
                if (this.lineWeightDivisions % 2 == 0) {
                    shouldSpringStartMatch = true;
                }

                if (shouldSpringStartMatch) {
                    if (j % 2 == 0) {
                        cp1 = pos1.add(new Vec2(-this.curveThreshold, -this.curveThreshold));
                        cp2 = pos2.add(new Vec2(-this.curveThreshold, this.curveThreshold));
                    } else {
                        cp1 = pos1.add(new Vec2(this.curveThreshold, -this.curveThreshold));
                        cp2 = pos2.add(new Vec2(this.curveThreshold, this.curveThreshold));
                    }
                } else {
                    let adder = this.lineWeightDivisions % 2;
                    if ((j+adder) % 2 == 0) {
                        cp1 = pos1.add(new Vec2(-this.curveThreshold, -this.curveThreshold));
                        cp2 = pos2.add(new Vec2(-this.curveThreshold, this.curveThreshold));
                    } else {
                        cp1 = pos1.add(new Vec2(this.curveThreshold, -this.curveThreshold));
                        cp2 = pos2.add(new Vec2(this.curveThreshold, this.curveThreshold));
                    }
                }
                
                // render segment as curve
                noFill();
                curve(cp1.getX(), cp1.getY(), pos1.getX(), pos1.getY(), pos2.getX(), pos2.getY(), cp2.getX(), cp2.getY())
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
function compareSprings(a, b) {
    return b.getLevel() - a.getLevel();
}

class Hair {
    constructor(mode) {
        this.springs = [];
        this.particles = [];
        this.fixedIds = [];

        if (mode=="starting") {
            this.setupHair_starting();
        }

        print(this.particles.length)
        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    createStrand_starting(startPos, idOffset) {
        for (let i = 0; i < p.springsPerStrand; i++) {
            let xPos = startPos.getX() + i*p.springLength;
            let newEndpoint = new SpringEndpoint(idOffset + i, new Vec2(xPos, startPos.getY()), 500, p.springsPerStrand - i);
            if (i > 0) {
                let neighbourEndpoint = this.particles[this.particles.length - 1];
                let newSpring = new Spring(idOffset + i, newEndpoint, neighbourEndpoint, p.springLength, 15000, 0.05, p.springsPerStrand - i);
                this.springs.push(newSpring);
            }
            this.particles.push(newEndpoint);
        }
        print(this.particles.length, idOffset)
        this.fixedIds.push(idOffset)
    }

    setupHair_starting() {
        for (let i = 0; i < p.numStrands; i++) {
            this.createStrand_starting(new Vec2(200 + (i%2)*p.hoffset, 300 + (i/2)*p.voffset), i*p.springsPerStrand);
        }
        // let xPosOffset = 200;
        // let yPos = 40;
        // for (let i = 0; i < p.springsPerStrand; i++) {
        //     let xPos = xPosOffset + i*p.springLength;
        //     let newEndpoint = new SpringEndpoint(i, new Vec2(xPos, yPos), 500, p.springsPerStrand - i);
        //     if (this.particles.length > 0) {
        //         let neighbourEndpoint = this.particles[this.particles.length - 1];
        //         let newSpring = new Spring(i, newEndpoint, neighbourEndpoint, p.springLength, 15000, 0.05, p.springsPerStrand - i);
        //         this.springs.push(newSpring);
        //     }
        //     this.particles.push(newEndpoint);
        // }

        // this.fixedIds = [0]
    }

    render() {
        let springs = this.springs.sort(compareSprings);
        let maxWeight = p.lineWeightDivisions * (p.springsPerStrand - 1)

        for (let i = 0; i < springs.length; i++) {
            let endpoints = springs[i].getEndpoints();
            let diff = endpoints[1].getPos().subtract(endpoints[0].getPos());
            let dist = diff.length2();
            diff = diff.scalarmult(1/dist);
            let spacing = dist / p.lineWeightDivisions;
            for (let j = 0; j < p.lineWeightDivisions; j++) {
                let weight = p.rootWidth*(springs[i].getLevel()/(p.springsPerStrand*2)) + (j*(1/p.lineWeightDivisions));
                strokeWeight(weight);
                // strokeWeight(weight);
                let pos1 = endpoints[0].getPos().add(diff.scalarmult(spacing*j));
                let pos2 = endpoints[0].getPos().add(diff.scalarmult(spacing*(j+1)));
                let cp1, cp2;
                let threshold = p.curveThreshold;

                let shouldSpringStartMatch = false;
                if (p.lineWeightDivisions % 2 == 0) {
                    shouldSpringStartMatch = true;
                }

                if (shouldSpringStartMatch) {
                    if (j % 2 == 0) {
                        cp1 = pos1.add(new Vec2(-threshold, -threshold));
                        cp2 = pos2.add(new Vec2(-threshold, threshold));
                    } else {
                        cp1 = pos1.add(new Vec2(threshold, -threshold));
                        cp2 = pos2.add(new Vec2(threshold, threshold));
                    }
                } else {
                    let adder = p.lineWeightDivisions % 2;
                    if ((j+adder) % 2 == 0) {
                        cp1 = pos1.add(new Vec2(-threshold, -threshold));
                        cp2 = pos2.add(new Vec2(-threshold, threshold));
                    } else {
                        cp1 = pos1.add(new Vec2(threshold, -threshold));
                        cp2 = pos2.add(new Vec2(threshold, threshold));
                    }
                }
                
                noFill();
                curve(cp1.getX(), cp1.getY(), pos1.getX(), pos1.getY(), pos2.getX(), pos2.getY(), cp2.getX(), cp2.getY())
                // line(pos1.getX(), pos1.getY(), pos2.getX(), pos2.getY());
            }
            
            // strokeWeight(springs[i].getLevel());
            // // stroke((12-springs[i].getLevel())/12 * 50)
            // line(endpoints[0].getPos().getX(), endpoints[0].getPos().getY(), endpoints[1].getPos().getX(), endpoints[1].getPos().getY())
        }
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }
}
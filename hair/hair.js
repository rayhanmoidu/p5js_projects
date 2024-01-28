function compareSprings(a, b) {
    return b.getLevel() - a.getLevel();
}

class Hair {
    constructor(mode, pos, headR) {
        this.springs = [];
        this.particles = [];
        this.fixedIds = [];
        this.numStrands = 0;
        

        if (mode=="starting") {
            this.setupHair_starting();
        } else if (mode=="head") {
            this.setupHair_head(pos, headR);
        }

        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    createStrand(startPos, idOffset) {
        for (let i = 0; i < p.springsPerStrand; i++) {
            let xPos = startPos.getX() + i*p.springLength;
            let newEndpoint = new SpringEndpoint(idOffset + i, new Vec2(xPos, startPos.getY()), 500*random(0.8, 1.2), p.springsPerStrand - i);
            if (i > 0) {
                let neighbourEndpoint = this.particles[this.particles.length - 1];
                let newSpring = new Spring(idOffset + i, newEndpoint, neighbourEndpoint, p.springLength, 15000, 0.05, p.springsPerStrand - i);
                this.springs.push(newSpring);
            }
            this.particles.push(newEndpoint);
        }
        this.fixedIds.push(idOffset)
        this.fixedIds.push(idOffset+1)
    }

    setupHair_head(pos, headR) {

        let diry = new Vec2(0.5, -0.5);
        let dirx = new Vec2(0.5, 0.5);


        let p1 = pos.add(dirx.scalarmult(-headR*sqrt(2)));
        let p2 = pos.add(dirx.scalarmult(headR*sqrt(2)));
        // let cp1 = p1.add(diry.scalarmult(-100));
        // let cp2 = p2.add(diry.scalarmult(-100));

        // fill(0);
        // stroke(100);
        // strokeWeight(50);
        // print(p1, p2, cp1, cp2);
        // stroke(0);
        // line(p1.getX(), p1.getY(), p2.getX(), p2.getY())
        // print("hello there", p1.getX(), p1.getY(), p2.getX(), p2.getY())
        this.curve = [p1, p2];




        let totalArea = headR*headR*2;
        let dim = sqrt(totalArea/p.numStrands);

        let startPos = pos.add(new Vec2(0, -25*sqrt(2)));
        // print("lalala", startPos)
        // print(startPos)

        let centreshiftx = dirx.scalarmult(dim / 2);
        let centreshifty = diry.scalarmult(dim / 2);

        for (let i = 0; i < round(headR*3 / dim); i++) {
            for (let j = 0; j < round(headR*1.5 / dim); j++) {
                let shiftx = dirx.scalarmult(i*dim);
                let shifty = diry.scalarmult(-j*dim);
                let strandPos = startPos.add(shiftx).add(shifty);
                // print(pos.subtract(strandPos).length2())
                if (pos.subtract(strandPos).length2() < headR) {
                    // print(strandPos)
                    this.createStrand(strandPos, this.numStrands*p.springsPerStrand);
                    this.numStrands ++;
                }
            }
        }


        // randomized
        // let squareCentre = pos.add(new Vec2(headR/sqrt(2), -headR/sqrt(2)))
        

        // let numStrandsCreated = 0;
        // while (1) {
        //     let shiftx = dirx.scalarmult(random(-headR, headR));
        //     let shifty = diry.scalarmult(random(-headR, headR));
        //     let strandPos = squareCentre.add(shiftx).add(shifty);
        //     if (pos.subtract(strandPos).length2() < headR) {
        //         this.createStrand(strandPos, numStrandsCreated*p.springsPerStrand);
        //         numStrandsCreated++;
        //     }

        //     if (numStrandsCreated==p.numStrands) {
        //         break;
        //     }
        // }

        // starting
        // for (let i = 0; i < p.numStrands; i++) {
        //     this.createStrand(new Vec2(pos.getX() + (i%2)*p.hoffset, pos.getY() + (i/2)*p.voffset), i*p.springsPerStrand);
        // }
    }

    setupHair_starting() {
        for (let i = 0; i < p.numStrands; i++) {
            this.createStrand(new Vec2(200 + (i%2)*p.hoffset, 300 + (i/2)*p.voffset), i*p.springsPerStrand);
        }
    }

    render_strand() {
        let springs = this.springs.sort(compareSprings);
        noFill();

        for (let j = 0; j < this.numStrands; j ++) {

            let startIndex = j*(p.springsPerStrand);
            
            let startingEndpoint = this.particles[startIndex];
            let endingEndpoint = this.particles[startIndex + (p.springsPerStrand - 1)];

            beginShape();
            curveVertex(startingEndpoint.getPos().getX(), startingEndpoint.getPos().getY());
            curveVertex(startingEndpoint.getPos().getX(), startingEndpoint.getPos().getY());

            for (let i = startIndex; i < startIndex + p.springsPerStrand; i++) {
                let endpoint = this.particles[i];
                curveVertex(endpoint.getPos().getX(), endpoint.getPos().getY());
            }

            curveVertex(endingEndpoint.getPos().getX(), endingEndpoint.getPos().getY());
            curveVertex(endingEndpoint.getPos().getX(), endingEndpoint.getPos().getY());

            endShape();
        }

    }

    render_braid() {
        push();
        let springs = this.springs.sort(compareSprings);

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
        // print(this.curve)
        // fill(0);
        // let diry = new Vec2(0.5, -0.5);
        // let cp1 = this.curve[0].add(diry.scalarmult(-p.dressTolerance));
        // let cp2 = this.curve[1].add(diry.scalarmult(-p.dressTolerance));
        // // line(this.curve[1].getX(), this.curve[1].getY(), this.curve[2].getX(), this.curve[2].getY())
        // curve(cp1.getX(), cp1.getY(), this.curve[0].getX(), this.curve[0].getY(), this.curve[1].getX(), this.curve[1].getY(), cp2.getX(), cp2.getY())
        pop();
    }
    render() {
        if (p.renderMode) {
            this.render_strand();
        } else {
            this.render_braid();
        }
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }
}
var restLengthFactor = 1;
var ks = 50000;
var kd = 0.005;

class Tree {
    constructor(mode, angleOffset, xPos, fractalFactor, branchingFactor, treeHeight, branchLength, branchLengthScalingFactor, startingMass, massScalingFactor) {
        this.springs = [];
        this.particles = [];
        this.fixedIds = []
        if (mode=="starting") {
            this.setupTree_starting();
        } else if (mode=="basicFractal") {
            
            this.setupTree_basicFractal(xPos, angleOffset, fractalFactor, branchingFactor, treeHeight, branchLength, branchLengthScalingFactor, startingMass, massScalingFactor);
        }
        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    setupTree_starting() {
        let se1 = new SpringEndpoint(0, new Vec2(100, 100), 5000);
        let se2 = new SpringEndpoint(1, new Vec2(200, 50), 5000);

        let spr1 = new Spring(0, se1, se2, 200, ks, kd);

        this.springs = [spr1];
        this.particles = [se1, se2];
    }

    setupTree_basicFractal(xPos, angleOffset, fractalFactor, branchingFactor, treeHeight, branchLength, branchLengthScalingFactor, startingMass, massScalingFactor) {
        let springs = [];
        let particles = [];

        let startPos = 700;
        let se1 = new SpringEndpoint(0, new Vec2(xPos, startPos), startingMass);
        let se2 = new SpringEndpoint(1, new Vec2(xPos, startPos - treeHeight), startingMass);
        let spr1 = new Spring(0, se1, se2, treeHeight*restLengthFactor, ks, kd);
        
        particles.push(se1);
        particles.push(se2);
        springs.push(spr1);

        this.fractalHelper(fractalFactor, angleOffset, branchingFactor, se2, se1, branchLength, branchLengthScalingFactor, springs, particles, startingMass, massScalingFactor);
        print(springs, particles)
        this.springs = springs;
        this.particles = particles;
        this.fixedIds = [0, 1];
    }

    fractalHelper(curLevel, angleOffset, branchingFactor, stem_endpoint, stem_connectingendpoint, branchLength, branchLengthScalingFactor, springs, particles, mass, massScalingFactor) {
        if (curLevel==0) {
            return;
        }
        
        let angleToDiv = PI - 2*angleOffset
        let thetaDiff = (angleToDiv / (branchingFactor+1));
        for (let i = 0; i < branchingFactor; i++) {
            
            let stemTheta = atan((stem_connectingendpoint.getPos().getX() - stem_endpoint.getPos().getX()) / (stem_connectingendpoint.getPos().getY() - stem_endpoint.getPos().getY()));
            let sign2 = (stem_endpoint.getPos().getY() - stem_connectingendpoint.getPos().getY()) / abs(stem_endpoint.getPos().getY() - stem_connectingendpoint.getPos().getY())
            
            if (sign2 > 0) {
                stemTheta += PI;
            }

            let diffx = branchLength * cos(angleOffset + thetaDiff * (i+1) + stemTheta);
            let diffy = branchLength * sin(angleOffset + thetaDiff * (i+1) + stemTheta);

            let new_endpoint = new SpringEndpoint(particles.length, new Vec2(stem_endpoint.getPos().getX() + diffx, stem_endpoint.getPos().getY() - diffy), mass);
            let new_spring = new Spring(springs.length, stem_endpoint, new_endpoint, branchLength*restLengthFactor, ks, kd);
            particles.push(new_endpoint);
            springs.push(new_spring);

            this.fractalHelper(curLevel-1, angleOffset, branchingFactor, new_endpoint, stem_endpoint, branchLength*branchLengthScalingFactor, branchLengthScalingFactor, springs, particles, mass*massScalingFactor, massScalingFactor);
        }
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }
}
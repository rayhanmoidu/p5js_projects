var restLengthFactor = 1;

class Tree {
    constructor(mode) {
        this.springs = [];
        this.particles = [];
        this.fixedIds = []
        if (mode=="starting") {
            this.setupTree_starting();
        } else if (mode=="basicFractal") {
            this.setupTree_basicFractal(6, 3, 300, 150, 0.5, 5000, 0.7);
        }
        for (let i = 0; i < this.fixedIds.length; i++) {
            this.particles[this.fixedIds[i]].fix();
        }
    }

    setupTree_starting() {
        let se1 = new SpringEndpoint(0, new Vec2(100, 100), 5000);
        let se2 = new SpringEndpoint(1, new Vec2(200, 50), 5000);

        let spr1 = new Spring(0, se1, se2, 200, 14000, 0);

        this.springs = [spr1];
        this.particles = [se1, se2];
    }

    setupTree_basicFractal(fractalFactor, branchingFactor, treeHeight, branchLength, branchLengthScalingFactor, startingMass, massScalingFactor) {
        let springs = [];
        let particles = [];

        let startPos = 700;
        let se1 = new SpringEndpoint(0, new Vec2(750, startPos), startingMass);
        let se2 = new SpringEndpoint(1, new Vec2(750, startPos - treeHeight), startingMass);
        let spr1 = new Spring(0, se1, se2, treeHeight*restLengthFactor, 14000, 0);
        
        particles.push(se1);
        particles.push(se2);
        springs.push(spr1);

        this.fractalHelper(fractalFactor, branchingFactor, se2, se1, branchLength, branchLengthScalingFactor, springs, particles, startingMass, massScalingFactor);
        print(springs, particles)
        this.springs = springs;
        this.particles = particles;
        this.fixedIds = [0, 1];
    }

    fractalHelper(curLevel, branchingFactor, stem_endpoint, stem_connectingendpoint, branchLength, branchLengthScalingFactor, springs, particles, mass, massScalingFactor) {
        if (curLevel==0) {
            return;
        }

        let thetaDiff = (PI / (branchingFactor+1));
        for (let i = 0; i < branchingFactor; i++) {
            
            let stemTheta = atan((stem_connectingendpoint.getPos().getX() - stem_endpoint.getPos().getX()) / (stem_connectingendpoint.getPos().getY() - stem_endpoint.getPos().getY()));
            //let sign1 = (stem_endpoint.getPos().getX() - stem_connectingendpoint.getPos().getX()) / abs(stem_endpoint.getPos().getX() - stem_connectingendpoint.getPos().getX())
            let sign2 = (stem_endpoint.getPos().getY() - stem_connectingendpoint.getPos().getY()) / abs(stem_endpoint.getPos().getY() - stem_connectingendpoint.getPos().getY())
            
            if (sign2 > 0) {
                stemTheta += PI;
            }
            
            // if (!sign1) {
            //     sign1 = 0
            // }
            // if (!sign2) {
            //     sign2 = 0
            // }

            let diffx = branchLength * cos(thetaDiff * (i+1) + stemTheta);
            let diffy = branchLength * sin(thetaDiff * (i+1) + stemTheta);

            let new_endpoint = new SpringEndpoint(particles.length, new Vec2(stem_endpoint.getPos().getX() + diffx, stem_endpoint.getPos().getY() - diffy), mass);
            let new_spring = new Spring(springs.length, stem_endpoint, new_endpoint, branchLength*restLengthFactor, 14000, 0);
            particles.push(new_endpoint);
            springs.push(new_spring);

            this.fractalHelper(curLevel-1, branchingFactor, new_endpoint, stem_endpoint, branchLength*branchLengthScalingFactor, branchLengthScalingFactor, springs, particles, mass*massScalingFactor, massScalingFactor);
        }
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }
}
let gravityF, windF, externalF;

class Simulation {
    constructor(timestep, cloth) {
        this.timestep = timestep;
        this.time = 0;

        this.particles = cloth.getSpringEndpoints();
        this.n = this.particles.length;
        this.springs = cloth.getSprings();
        this.fixedIds = cloth.getFixedIds();

        this.physicsCalculator = new PhysicsCalculator();
        this.massMatrix = this.physicsCalculator.computeMassMatrix(this.n, this.particles);
        this.hessian = this.physicsCalculator.computeHessian(this.n, this.springs, this.massMatrix, this.timestep);

        // globals
        gravityF = new Vec3(0, 200, 0);
        windF = new Vec3(0, 0, 0); 
        externalF = gravityF.add(windF);
    }

    update() {
        // this.applyExternalForces();
        // this.applySpringForces();
        // this.computeNewParticleStates();

        this.optimizationImplicitEuler();
        this.time += this.timestep;
    }

    getParticlePositions() {
        let curPosition = new eigen.Matrix(this.n*3);
        let prevPosition = new eigen.Matrix(this.n*3);
        for (let i = 0; i < this.particles.length; i++) {
            curPosition.set(i*3, this.particles[i].getPos().getX());
            curPosition.set(i*3 + 1, this.particles[i].getPos().getY());
            curPosition.set(i*3 + 2, this.particles[i].getPos().getZ());

            prevPosition.set(i*3, this.particles[i].getOldPos().getX());
            prevPosition.set(i*3 + 1, this.particles[i].getOldPos().getY());
            prevPosition.set(i*3 + 2, this.particles[i].getOldPos().getZ());
        }
        return [curPosition, prevPosition];
    }

    applyNewtonsMethod() {
        let positions = this.getParticlePositions();
        let curPosition = positions[0];
        let prevPosition = positions[1];

        let curGuessPosition = curPosition;
        let gradient = this.physicsCalculator.computeGradient(this.n, this.springs, this.particles, curGuessPosition, curPosition, prevPosition, this.massMatrix, this.timestep);

        let numIterations = 0;

        // print("starting newton")

        while (gradient.norm() > Number.EPSILON) {
            let neg_hessian = this.hessian.mul(-1);
            // print("hehe", neg_hessian)
            let dir = this.hessian.matMul(gradient);
            curGuessPosition = curGuessPosition.matSub(dir);
            // print("inside newton", gradient.norm())
            gradient = this.physicsCalculator.computeGradient(this.n, this.springs, this.particles, curGuessPosition, curPosition, prevPosition, this.massMatrix, this.timestep);
            numIterations += 1;
            if (numIterations > 10) {
                break;
            }
        }

        return curGuessPosition;
    }

    optimizationImplicitEuler() {
        let newParticleState = this.applyNewtonsMethod();
        for (let i = 0; i < this.particles.length; i++) {
            let particleID = this.particles[i].getID();
            let newpos = new Vec3(newParticleState.get(particleID*3), newParticleState.get(particleID*3 + 1), newParticleState.get(particleID*3 + 2));
            this.particles[i].updatePos(newpos);
        }
    }

    applyExternalForces() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].addForce(gravityF.add(windF));
        }
    }
    
    applySpringForces() {
        for (let i = 0; i < this.springs.length; i++) {
            let pos1 = this.springs[i].getEndpoints()[0].getPos();
            let pos2 = this.springs[i].getEndpoints()[1].getPos();

            let sf = this.physicsCalculator.computeSpringForce(pos1, pos2, this.springs[i].getR(), this.springs[i].getKs());
            // let df = this.physicsCalculator.computeDampingForce(this.springs[i]);

            let endpoints = this.springs[i].getEndpoints();
            endpoints[0].addForce(sf);
            endpoints[1].addForce(sf.scalarmult(-1));
            // endpoints[0].addForce(df.scalarmult(-1));
            // endpoints[1].addForce(df);
        }
    }

    computeNewParticleStates() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].computeNewPosition(this.timestep);
            this.particles[i].resetForces();
        }
    }
}
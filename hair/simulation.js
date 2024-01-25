class Simulation {
    constructor(springs, particles, timestep) {
        this.springs = springs;
        this.particles = particles;
        this.n = particles.length;
        this.fixedIds = [];
        this.timestep = timestep;
        this.time = 0;
        this.physicsCalc = new PhysicsCalculator();
        this.externalForce = new Vec2(0, 0);
    }

    update() {
        this.applySpringForces();
        this.applyExternalForces(); // should come from beats
        this.computeNewParticleStates();
        this.time += this.timestep;
        this.resetForces();
    }

    addExternalForce(f) {
        this.externalForce = this.externalForce.add(f);
    }

    resetExternalForces() {
        this.externalForce = new Vec2(0, 0);
    }

    applySpringForces() {
        for (let i = 0; i < this.springs.length; i++) {
            let endpoints = this.springs[i].getEndpoints();
            let f1 = this.physicsCalc.calculateSpringForce(endpoints[0], endpoints[1], this.springs[i].getR(), this.springs[i].getKs());
            let f2 = this.physicsCalc.calculateSpringForce(endpoints[1], endpoints[0], this.springs[i].getR(), this.springs[i].getKs());
            let d1 = this.physicsCalc.calculateDampingForce(endpoints[0], endpoints[1], this.springs[i].getR(), this.springs[i].getKd());
            let d2 = this.physicsCalc.calculateDampingForce(endpoints[1], endpoints[0], this.springs[i].getR(), this.springs[i].getKd());

            endpoints[0].addForce(f1);
            endpoints[1].addForce(f2);
            // endpoints[0].addForce(d1);
            // endpoints[1].addForce(d2);
        }
    }

    applyExternalForces() {
        for (let i = 0; i < this.n; i++) {
            this.particles[i].addForce(this.externalForce);
            // this.particles[i].addReturningForce();
        }
    }

    resetForces() {
        for (let i = 0; i < this.n; i++) {
            this.particles[i].clearForce();
        }
    }

    computeNewParticleStates() {
        for (let i = 0; i < this.n; i++) {
            this.particles[i].computeNewPosition_verlet(this.timestep);
        }
        //postProcess();
    }

    getParticles() {
        return this.particles;
    }

    getSprings() {
        return this.springs;
    }
}
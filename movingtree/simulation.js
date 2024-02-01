class Simulation {
    constructor(springs, particles, timestep) {
        // springs and particles being processed by simulation
        this.springs = springs;
        this.particles = particles;

        this.n = particles.length;
        
        this.timestep = timestep;
        this.time = 0;

        // physics calculator for spring forces
        this.physicsCalc = new PhysicsCalculator();

        // keeps track of external forces to be applied to particles
        this.externalForces = new Vec2(0, 0);
    }

    update(z) {
        // apply forces to particles
        this.applySpringForces();
        this.applyExternalForces(z);

        // compute new particle positions
        this.computeNewParticleStates();

        // increment time and reset forces
        this.time += this.timestep / frameRate();
        this.resetForces();
    }

    addExternalForce(f) {
        this.externalForces = this.externalForces.add(f);
    }

    resetExternalForces() {
        this.externalForces = new Vec2(0, 0);
    }

    applySpringForces() {
        // iterate through all springs, and apply corresponding force onto each particle
        for (let i = 0; i < this.springs.length; i++) {
            let endpoints = this.springs[i].getEndpoints();
            let f1 = this.physicsCalc.calculateSpringForce(endpoints[0], endpoints[1], this.springs[i].getR(), this.springs[i].getKs());
            let f2 = this.physicsCalc.calculateSpringForce(endpoints[1], endpoints[0], this.springs[i].getR(), this.springs[i].getKs());

            endpoints[0].addForce(f1);
            endpoints[1].addForce(f2);
        }
    }

    applyExternalForces(z) {
        // iterate through all particles, and apply external force onto each
        for (let i = 0; i < this.n; i++) {
            this.particles[i].addForce(this.externalForces);
            this.particles[i].addTreeForce(z);
        }
    }

    resetForces() {
        // iterate through all particles, and clear their force vector
        for (let i = 0; i < this.n; i++) {
            this.particles[i].clearForce();
        }
    }

    computeNewParticleStates() {
        // iterate through all particles, and adjust their positions
        for (let i = 0; i < this.n; i++) {
            this.particles[i].computeNewPosition(this.timestep);
        }
    }

    getParticles() {
        return this.particles;
    }

    getSprings() {
        return this.springs;
    }

    getTime() {
        return this.time;
    }
}
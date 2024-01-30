class Simulation {
    constructor(springs, particles, timestep) {
        this.springs = springs;
        this.particles = particles;
        this.n = particles.length;
        this.fixedIds = [];
        this.timestep = timestep;
        this.time = 0;
        this.physicsCalc = new PhysicsCalculator();
        this.externalForces = new Vec2(0, 0);
    }

    update(z) {
        // print(this.externalForces)
        this.applySpringForces();
        this.applyExternalForces(z); // should come from beats
        this.computeNewParticleStates();
        this.time += this.timestep / frameRate();
        this.resetForces();
    }

    addExternalForce(key, f) {
        // this.externalForces.push({"key": key, "f": f});
        // this.externalForces = (f);
        // if (key=="gravity") {
        //     this.externalForce = this.externalForce.add(f.scalarmult());
        // }
        this.externalForces = this.externalForces.add(f);
    }

    resetExternalForces() {
        // print(this.externalForces.length)
        this.externalForces = new Vec2(0, 0);
    }

    applySpringForces() {
        for (let i = 0; i < this.springs.length; i++) {
            let endpoints = this.springs[i].getEndpoints();
            let f1 = this.physicsCalc.calculateSpringForce(endpoints[0], endpoints[1], this.springs[i].getR(), this.springs[i].getKs());
            let f2 = this.physicsCalc.calculateSpringForce(endpoints[1], endpoints[0], this.springs[i].getR(), this.springs[i].getKs());
            let d1 = this.physicsCalc.calculateDampingForce(endpoints[0], endpoints[1], this.springs[i].getR(), this.springs[i].getKd());
            let d2 = this.physicsCalc.calculateDampingForce(endpoints[1], endpoints[0], this.springs[i].getR(), this.springs[i].getKd());

            // if (!isNaN(f1) && !isNaN(f1)) {
                endpoints[0].addForce(f1);
                endpoints[1].addForce(f2);
            // }
            // endpoints[0].addForce(d1);
            // endpoints[1].addForce(d2);
        }
    }

    applyExternalForces(z) {
        for (let i = 0; i < this.n; i++) {
            // print(this.externalForces.length)
            // for (let j = 0; j < this.externalForces.length; j++) {
            //     this.particles[i].applyForce(this.externalForces[j]);
            // }
            this.particles[i].addForce(this.externalForces);
            this.particles[i].addReturningForce(z);
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
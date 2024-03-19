//
// Created by Rayhan Moidu on 2023-07-08.
//

class Simulation {
    constructor(timestep, cloth) {
        this.timestep = timestep;
        this.time = 0;

        this.particles = cloth.getSpringEndpoints();
        this.n = this.particles.length;
        this.springs = cloth.getSprings();
        this.fixedIds = cloth.getFixedIds();

        this.physicsCalculator = new PhysicsCalculator();
    }

    update() {
        this.applyExternalForces();
        this.applySpringForces();
        this.computeNewParticleStates();
        this.time += this.timestep;
    }

    applyExternalForces() {
        for (let i = 0; i < this.particles.length; i++) {
            let gravityF = new Vec3(0, 0, 0);
            let windF = new Vec3(0, 0, 0); 
            this.particles[i].addForce(gravityF.add(windF));
        }
    }
    
    applySpringForces() {
        for (let i = 0; i < this.springs.length; i++) {
            let sf = this.physicsCalculator.computeSpringForce(this.springs[i]);
            // let df = this.physicsCalculator.computeDampingForce(this.springs[i]);

            let endpoints = this.springs[i].getEndpoints();
            endpoints[0].addForce(sf);
            endpoints[1].addForce(sf.scalarmult(-1));
            // endpoints[0].addForce(df);
            // endpoints[1].addForce(df.scalarmult(-1));
        }
    }

    computeNewParticleStates() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].computeNewPosition(this.timestep);
            this.particles[i].resetForces();
        }
    }
}
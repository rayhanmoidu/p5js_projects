class Engine {
    constructor(id, ghost, timestep) {
        this.id = id;
        this.ghost = ghost;

        // force that entity is under the influence of
        this.f = new Vec3(random(-1, 1), random(-1, 1), random(-0.1, 0.1));
        this.f = this.f.normalize();

        this.timestep = timestep;
        this.time = 0;
    }

    update() {
        this.time += this.timestep;
        this.perturbF();

        let newpos = this.computeNewPosition(this.timestep);
        let finalpos = this.applyWorldConstraints(newpos, this.ghost.getPos());

        this.ghost.setOldPos(finalpos[1]);
        this.ghost.setPos(finalpos[0]);
    }

    // compute new position using Verlet integration
    computeNewPosition(timeStep) {
        let newF = this.f.scalarmult(this.ghost.getInverseMass()).scalarmult(0.005);
        
        let posDiff = this.ghost.getPos().subtract(this.ghost.getOldPos());
        let term1 = this.ghost.getPos().add(posDiff);

        let newpos = newF.scalarmult(timeStep*timeStep).add(term1);
        
        return newpos;
    }

    // adjusts direction vector slightly using Perlin noise, to allow ghost movement to be non-uniform
    perturbF() {
        let curNoise = noise(this.time);

        let newf = this.f.scalarmult(curNoise);
        newf = newf.normalize();

        this.f = this.f.scalarmult(1-p.noiseLevel).add(newf.scalarmult(p.noiseLevel))
        this.f = this.f.normalize();
    }

    
    // applies a world-box constraint to prevent position updates from crossing thresholds of 3D space
    applyWorldConstraints(newpos, curpos) {
      let cur = new Vec3(curpos.getX(), curpos.getY(), curpos.getZ());
      let newp = new Vec3(newpos.getX(), newpos.getY(), newpos.getZ());

      let xBuffer = 0;
      let yBuffer = 0;
  
      let zMax = p.zDepth;
      let zMin = 0.2;
      let xMax = width + xBuffer;
      let xMin = -xBuffer;
      let yMax = height + yBuffer;
      let yMin = -yBuffer;

      let newX = this.applyWorldConstraint_Dim(newp.getX(), cur.getX(), xMin, xMax);
      let newY = this.applyWorldConstraint_Dim(newp.getY(), cur.getY(), yMin, yMax);
      let newZ = this.applyWorldConstraint_Dim(newp.getZ(), cur.getZ(), zMin, zMax);

      newp.setX(newX[0]);
      newp.setY(newY[0]);
      newp.setZ(newZ[0]);
      cur.setX(newX[1]);
      cur.setY(newY[1]);
      cur.setZ(newZ[1]);
      return [newp, cur];
    }

    // applies world-box constraint over one dimension
    applyWorldConstraint_Dim(newpos, curpos, min, max) {
      let cur = curpos;
      let newp = newpos;
      if (newp > max) {
          let distToReflect = newp - cur;
          cur = newp + distToReflect;

          let distToTranslate = newp - max;
          newp = max;
          cur -= distToTranslate;
      }
      if (newp < min) {
          let distToReflect = newp  - cur;
          cur = newp + distToReflect;

          let distToTranslate = newp - max;
          newp = max;
          cur -= distToTranslate;
      }
      return [newp, cur];
  }

    getTime() {
      return this.time;
    }
}
class Engine {
    constructor(id, ghost, timestep) {
        this.ghost = ghost;
        this.f = new Vec3(random(-1, 1), random(-1, 1), random(-0.1, 0.1));
        this.f = this.f.normalize();
        this.timestep = timestep;
        this.time = 0;
        this.id = id;
    }

    update() {
        this.time += this.timestep;
        this.perturbF();
        // add random dir
        let verletpos = this.computeNewPosition(this.timestep);
        let lightsourcepos = this.getLightSourcePos();
        // let newpos = verletpos.add(lightsourcepos).scalarmult(0.5);
        let newpos = verletpos;

        let finalpos = this.applyWorldConstraints(newpos, this.ghost.getPos());

        this.ghost.setOldPos(finalpos[1]);
        this.ghost.setPos(finalpos[0]);

        // this.ghost.setOldPos(this.ghost.getPos());
        // this.ghost.setPos(newpos);

        // this.processCollisions();
    }

    computeNewPosition(timeStep) {
        // compute new position using Verlet integration
        let newF = this.f.scalarmult(this.ghost.getInverseMass()).scalarmult(0.001);
        
        let posDiff = this.ghost.getPos().subtract(this.ghost.getOldPos());
        let term1 = this.ghost.getPos().add(posDiff);

        let newpos = newF.scalarmult(timeStep*timeStep).add(term1);
        
        // adjust pos and oldpos
        // this.ghost.setOldPos(this.pos);
        // this.ghost.setPos(newpos);
        return newpos;
    }

    // get() {

    // }

    getLightSourcePos() {
        let lightpos = new Vec3(lx, ly, lz);
        let d = this.ghost.getPos().subtract(lightpos).length2();
        let alpha = (p.lr - d)/p.lr;
        let attractedpos = this.ghost.getPos();
        if (alpha>0) {
            alpha *= 0.2;
            attractedpos = this.ghost.getPos().scalarmult(1-alpha).add(lightpos.scalarmult(alpha));
        }
        return attractedpos;
    }

    getTime() {
      return this.time;
    }

    perturbF() {
        let curNoise = noise(this.time);

        let newf = this.f.scalarmult(curNoise);
        newf = newf.normalize();

        this.f = this.f.scalarmult(1-p.noiseLevel).add(newf.scalarmult(p.noiseLevel))
        this.f = this.f.normalize();
    }

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

      processCollisions() {
        for (let i = 0; i < ghosts.length; i++) {
          let overlapPerc = this.getOverlap(ghosts[i]);
          if (overlapPerc > 0) {
            let overlap = this.ghost.getPos().subtract(ghosts[i].getPos());
            overlap = overlap.normalize();
    
            this.ghost.getPos().setX(this.ghost.getPos().getX() + overlapPerc*overlap.getX()*5);
            this.ghost.getPos().setY(this.ghost.getPos().getY() + overlapPerc*overlap.getY()*5);
            // this.ghost.getPos().setZ(this.ghost.getPos().getZ() + overlapPerc*overlap.getZ());
          }
        }
      }
    
      getOverlap(ghost) {
        if (this.id == ghost.getID()) {
          return 0;
        }
    
        let bbox_x = (this.ghost.getPos().getZ() * p.bboxScale) * this.bbox_w;
        let bbox_y = (this.ghost.getPos().getZ() * p.bboxScale) * this.bbox_h;
        let bbox_z = (this.ghost.getPos().getZ() * p.bboxScale) * this.bbox_z;
    
        let dx = abs(this.ghost.getPos().getX() - ghost.getPos().getX());
        let dy = abs(this.ghost.getPos().getY() - ghost.getPos().getY());
        let dz = abs(this.ghost.getPos().getZ() - ghost.getPos().getZ())
    
        if (dx < bbox_x && dy < bbox_y) {
          let percX = (bbox_x - dx) / bbox_x;
          let percY = (bbox_y - dy) / bbox_y;
          let percZ = (bbox_z - dz) / bbox_z;
          return percX*percY*percZ;
        }
        return 0;
      }
}
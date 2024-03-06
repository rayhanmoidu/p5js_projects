let ghostWidth = 375;
let ghostHeight = 666;

class Ghost {
  // local shape transforms
  // sscale = 0.1;
  // angle = 0.0;

  constructor(id, pos, m, shape) {
    this.curNoise = 0;
    this.id = id;

    this.opacity = 0;

    this.pos = pos;
    this.oldpos = pos;

    this.shape = shape;
    this.m = m;

    this.dir = new Vec3(random(0, 0.45), random(0, 0.45), random(0, 0.1));
    this.dir = this.dir.normalize();

    this.bbox_w = ghostWidth;
    this.bbox_h = ghostHeight;
    this.bbox_z = 30;

    this.step = new Vec3(random(-1, 1), random(-1, 1), random(-0.1, 0.1));
    this.engine = new Engine(id, this, 0.5);
  }

  update() {
    this.engine.update();
  }

  draw() {
    push();

    translate(this.pos.getX(), this.pos.getY());
    scale(50/this.pos.getZ());
    // rotate(radians(this.angle));

    noStroke();
    noFill();
    imageMode(CENTER);


    let maxOpacity = 100;

    let depthOpacity = (1 - (this.pos.getZ()/p.zDepth));

    let lightSourceOpacity = 0;
    for (let i = 0; i < lx.length; i++) {
      let lightSource = new Vec3(lx[i], ly[i], lz[i]);
      let posDiff = this.pos.subtract(lightSource).length2();
      if (posDiff < p.lr) {
        lightSourceOpacity += (p.lr - posDiff) / p.lr;
      }
    }

    lightSourceOpacity = min(lightSourceOpacity, 1);

    // let lightSource = new Vec3(lx, ly, lz);
    // let posDiff = this.pos.subtract(lightSource).length2();
    // if (posDiff < p.lr) {
    //   lightSourceOpacity = (p.lr - posDiff) / p.lr;
    // }

    let newOpacity = maxOpacity*lightSourceOpacity;
    if (newOpacity > this.opacity) {
      this.opacity = newOpacity
    } else {
      if (newOpacity >= this.opacity - p.ghostFade) {
        this.opacity = newOpacity;
      } else {
        this.opacity = max(0, this.opacity - p.ghostFade);
      }
    }
    tint(255, 255, 255, this.opacity)

    image(this.shape, 0, 0);

    pop();
  }

  // ************************* GETTERS / SETTERS ************************* //

  getOldPos() {
    return this.oldpos;
  }

  setOldPos(pos) {
    this.oldpos = pos;
  }

  getPos() {
    return this.pos;
  }

  setPos(newpos) {
    this.pos = newpos;
  }

  getInverseMass() {
    return 1/this.m;
  }

  getID() {
    return this.id;
  }
}

class Om {
  // local shape transforms
  // sscale = 0.1;
  // angle = 0.0;

  constructor(id, pos, m) {
    this.curNoise = 0;
    this.id = id;

    this.opacity = 0;

    this.pos = pos;
    this.oldpos = pos;

    this.m = m;

    // this.dir = new Vec3(random(0, 0.45), random(0, 0.45), random(0, 0.1));
    // this.dir = this.dir.normalize();

    // this.step = new Vec3(random(-1, 1), random(-1, 1), random(-0.1, 0.1));
    this.engine = new Engine(id, this, 0.5);

    this.prevOpacity = 0;

    this.omComponents = new OmComponents(5);

    this.tint1 = int(random(0, 255));
    this.tint2 = int(random(0, 255));
    this.tint3 = int(random(0, 255));

    this.imgs = randomImgs[int(random(0, randomImgs.length - 1))]
    // print(randomImgs)
  }

  update() {
    this.engine.update();
  }

  draw() {

    // let lightSourceOpacity = 0;
    // for (let i = 0; i < lx.length; i++) {
    //   let lightSource = new Vec3(lx[i], ly[i], lz[i]);
    //   let posDiff = this.pos.subtract(lightSource).length2();
    //   if (posDiff < p.lr) {
    //     lightSourceOpacity += (p.lr - posDiff) / p.lr;
    //   }
    // }
    // lightSourceOpacity = min(lightSourceOpacity, 1);



    let componentPositions = this.omComponents.getPositions();

    // if (lightSourceOpacity > 0) {

    this.renderOmComponent(this.omComponents.getPosition(0, sin(this.engine.getTime()/200)+1), this.imgs[0], p.om1x, p.om1y)
    this.renderOmComponent(this.omComponents.getPosition(1, sin(this.engine.getTime()/200)+1), this.imgs[1], p.om2x, p.om2y)
    this.renderOmComponent(this.omComponents.getPosition(2, sin(this.engine.getTime()/200)+1), this.imgs[2], p.om3x, p.om3y)
    this.renderOmComponent(this.omComponents.getPosition(3, sin(this.engine.getTime()/200)+1), this.imgs[3], p.om4x, p.om4y)
    this.renderOmComponent(this.omComponents.getPosition(4, sin(this.engine.getTime()/200)+1), this.imgs[4], p.om5x, p.om5y)
    // }
  }

  renderOmComponent(offset, img, imgOffX, imgOffY) {
    push();

    let correctPos = this.pos.add(offset);

    translate(correctPos.getX(), correctPos.getY());
    scale(50/correctPos.getZ());
    // rotate(radians(this.angle));

    noStroke();
    noFill();
    imageMode(CENTER);


    let maxOpacity = 150;

    let depthOpacity = (1 - (correctPos.getZ()/p.zDepth));

    let lightSourceOpacity = 0;
    for (let i = 0; i < lx.length; i++) {
      let lightSource = new Vec3(lx[i], ly[i], lz[i]);
      let posDiff = correctPos.subtract(lightSource).length2();
      if (posDiff < p.lr) {
        let lalala = (p.lr - posDiff) / p.lr
        lightSourceOpacity += lalala*lalala;
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

    if (this.opacity > 0) {
    tint(255, 255, 255, this.opacity)
    this.prevOpacity = newOpacity;

    // let componentPositions = this.omComponents.getPositions();

    image(img, imgOffX, imgOffY);
    }

    // image(this.shape, 0, 0);

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

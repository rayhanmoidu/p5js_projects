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
    this.timestep = 0.5;
    this.engine = new Engine(id, this, this.timestep);

    this.prevOpacity = 0;

    this.omComponents = new OmComponents(5);

    this.tint1 = int(random(0, 255));
    this.tint2 = int(random(0, 255));
    this.tint3 = int(random(0, 255));

    this.imgs = randomImgs[int(random(0, randomImgs.length - 1))]

    this.lalaoffset = 1;
    this.laladir = 0;
    this.time = 0;
    // print(randomImgs)

    this.detectedMotion = false;
  }

  update() {
    this.engine.update();
    if (opticalFlow <= 7) {
      this.time += this.timestep;
    }

    // when still, offset follows main sine curve
    // when there is motion, keep offset to be around max of sine curve
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

    let step = 150;

    // if (lightSourceOpacity > 0) {
      if (opticalFlow > 7 && !this.detectedMotion) {
        this.detectedMotion = true;
      } 
      // this.detectedMotion = 
    // let curOffset = 0;
    if (this.detectedMotion) {
      this.lalaoffset += this.timestep/step;
      if (this.lalaoffset >= 2) {
        this.detectedMotion = false;
        this.time = step * 1.5708;
      }
      // this.lalaoffset = min(2, this.lalaoffset);
      // this.time = (200*PI)/2;
      // print("motion ", this.lalaoffset)
    } else {
      // print(sin(1.5708));
      this.lalaoffset = sin(this.time/step)+1;
      // if (this.lalala) {
      //   print("no motion ", this.lalaoffset)
      //   this.lalala = false;
      // }
    }

    
    this.lalaoffset = sin(this.time/step)+1;

    // let curOffset = 0;
    // if (opticalFlow > 7) {
    //   curOffset = 0.1*sin(this.time/200)+2;
    // } else {
    //   curOffset = sin(this.time/200)+1;
    // }
  
    // if (opticalFlow > 7) {
    //   this.laladir += (0.00001 * opticalFlow * 1/(this.lalaoffset+1));
    //   this.lalaoffset += this.laladir;
    // } else {
    //   this.laladir = -this.lalaoffset*(0.01);
    //   this.lalaoffset += this.laladir;
    // }

    // this.lalaoffset = max(0, this.lalaoffset)

    // this.lalaoffset = curOffset;

    // print(this.lalaoffset)

    // globalOffset = this.lalaoffset;

    this.renderOmComponent(this.omComponents.getPosition(0, this.lalaoffset), this.imgs[0], p.om1x, p.om1y)
    this.renderOmComponent(this.omComponents.getPosition(1, this.lalaoffset), this.imgs[1], p.om2x, p.om2y)
    this.renderOmComponent(this.omComponents.getPosition(2, this.lalaoffset), this.imgs[2], p.om3x, p.om3y)
    this.renderOmComponent(this.omComponents.getPosition(3, this.lalaoffset), this.imgs[3], p.om4x, p.om4y)
    this.renderOmComponent(this.omComponents.getPosition(4, this.lalaoffset), this.imgs[4], p.om5x, p.om5y)
    // }
  }

  renderOmComponent(offset, img, imgOffX, imgOffY) {
    push();

    let correctPos = this.pos.add(offset);

    translate(correctPos.getX(), correctPos.getY());
    scale(p.zscale/correctPos.getZ());
    // rotate(radians(this.angle));

    noStroke();
    noFill();
    imageMode(CENTER);


    let maxOpacity = 255 - map(this.lalaoffset, 0, 2, 0, 175);

    let real_lr = p.lr + map(this.lalaoffset, 0, 2, 100, 0);

    let depthOpacity = (1 - (correctPos.getZ()/p.zDepth));

    let lightSourceOpacity = 0;
    for (let i = 0; i < lx.length; i++) {
      let lightSource = new Vec3(lx[i], ly[i], lz[i]);
      let posDiff_a = correctPos.subtract(lightSource)
      posDiff_a.setZ(posDiff_a.getZ()*(width/p.zDepth))
      let posDiff = posDiff_a.length2()
      if (posDiff < real_lr) {
        let lalala = (real_lr - posDiff) / real_lr
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

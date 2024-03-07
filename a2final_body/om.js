class Om {

  constructor(id, pos, m) {
    this.curNoise = 0;
    this.id = id;

    this.opacity = 0;

    this.pos = pos;
    this.oldpos = pos;

    this.m = m;

    this.timestep = 0.5;
    this.engine = new Engine(id, this, this.timestep);

    this.prevOpacity = 0;

    this.omComponents = new OmComponents(5);

    this.imgs = randomImgs[int(random(0, randomImgs.length - 1))]

    this.lalaoffset = 1;
    this.laladir = 0;
    this.time = 0;
    this.detectedMotion = false;
    this.circle_t = 0;

    this.nn = true;

    this.adding = false;
    this.addingtimer = 0;
  }

  update() {
    this.engine.update();
    let mult = 1;
    if (opticalFlow > 7 && opticalFlow < 100) {
      mult = opticalFlow
    }

    let circleSpeed = (75/mult);

    let pidiff = ((PI - abs(PI - this.circle_t)) + 1) / PI;
    pidiff = pidiff*pidiff

    // let gradientFactor = sqrt((this.circle_t+1)/(2*PI))
    this.circle_t += abs(this.timestep*pidiff/circleSpeed);


    if (this.circle_t > 2*PI) {
      this.circle_t -= 2*PI;
    }
    // if (opticalFlow <= 7) {
    //   this.time += this.timestep;
    // }
  }

  draw() {
    let step = 150;

    this.lalaoffset = sin(this.time/step)+1;
    // this.circle_t = 0;

    this.renderOmComponent(this.omComponents.getPosition_circle(0, this.circle_t), this.imgs[0], p.om1x, p.om1y)
    this.renderOmComponent(this.omComponents.getPosition_circle(1, this.circle_t), this.imgs[1], p.om2x, p.om2y)
    this.renderOmComponent(this.omComponents.getPosition_circle(2, this.circle_t), this.imgs[2], p.om3x, p.om3y)
    this.renderOmComponent(this.omComponents.getPosition_circle(3, this.circle_t), this.imgs[3], p.om4x, p.om4y)
    this.renderOmComponent(this.omComponents.getPosition_circle(4, this.circle_t), this.imgs[4], p.om5x, p.om5y)
  }

  renderOmComponent(offset, img, imgOffX, imgOffY) {
    push();
    // print(offset)
    let correctPos = this.pos.add(offset);

    let maxOpacity = 255 - map(this.lalaoffset, 0, 2, 0, 100);
    let lightradius_adder = map(this.lalaoffset, 0, 2, 0, 100);
    lightradius_adder = 100 - lightradius_adder;
    let real_lr = p.lr + lightradius_adder;
    // real_lr = 100 - real_lr;

    let lightSourceOpacity = 0;
    for (let i = 0; i < lx.length; i++) {
      let lightSource = new Vec3(lx[i], ly[i], lz[i]);
      let posDiff_a = correctPos.subtract(lightSource)
      // posDiff_a.setZ(posDiff_a.getZ()*2)
      let posDiff = posDiff_a.length2()
      if (posDiff < real_lr) {
        let lalala = (real_lr - posDiff) / real_lr
        lightSourceOpacity += lalala;
      }
    }

    translate(correctPos.getX(), correctPos.getY());
    scale(p.zscale/correctPos.getZ());

    noStroke();
    noFill();
    imageMode(CENTER);

    // let maxOpacity = 255 - map(this.lalaoffset, 0, 2, 0, 175);
    // let real_lr = p.lr + map(this.lalaoffset, 0, 2, 100, 0);

    let depthOpacity = (1 - (correctPos.getZ()/p.zDepth));

    // let lightSourceOpacity = 0;
    // for (let i = 0; i < lx.length; i++) {
    //   let lightSource = new Vec3(lx[i], ly[i], lz[i]);
    //   let posDiff_a = correctPos.subtract(lightSource)
    //   // posDiff_a.setZ(posDiff_a.getZ()*(width/p.zDepth))
    //   let posDiff = posDiff_a.length2()
    //   if (posDiff < real_lr) {
    //     let lalala = (real_lr - posDiff) / real_lr
    //     lightSourceOpacity += lalala*lalala;
    //   }
    // }

    lightSourceOpacity = min(lightSourceOpacity, 1);

    // print(maxOpacity, lightSourceOpacity)

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
      // print("hello")
      tint(255, 255, 255, (this.opacity+this.prevOpacity)/2)
      this.prevOpacity = newOpacity;
      image(img, imgOffX, imgOffY);
    }

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

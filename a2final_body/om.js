let om1x = [-50, 78]
let om1y = [-347, -116]
let om1r = [0, 1.1]
let om2x = [-379, 231]
let om2y = [9, -132]
let om2r = [0, 7.5]
let om3x = [-42, -99]
let om3y = [-56, 156]
let om3r = [0, 4.6]
let om4x = [-333, 198]
let om4y = [-278, 464]
let om4r = [0, 4.5]
let om5x = [-76, -172]
let om5y = [-407, -341]
let om5r = [0, 0]

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

    this.indind = 0;
    this.toggled = false;
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
      this.toggled = false;
    }

    if (this.circle_t > PI && !this.toggled) {
      this.toggled = true;
      this.indind += 1;
      if (this.indind > 1) {
        this.indind = 0;
      }
    }
    // if (opticalFlow <= 7) {
    //   this.time += this.timestep;
    // }
  }

  draw() {
    let step = 150;

    this.lalaoffset = sin(this.time/step)+1;
    // this.circle_t = 0;

    let r = 20;
    let i = this.indind;

    let tt = (abs(PI - this.circle_t)) / PI;
    // let tt = 1;

    // this.circle_t = 0;

    // MAKE ROTATION INTO A CIRCLE AND TRY WITH DIFF LALALAS

    this.renderOmComponent(i, this.omComponents.getPosition_circle(0, this.circle_t), this.imgs[0], tt*om1x[i], tt*om1y[i], tt*om1r[i])
    this.renderOmComponent(i, this.omComponents.getPosition_circle(1, this.circle_t), this.imgs[1], tt*om2x[i], tt*om2y[i], tt*om2r[i])
    this.renderOmComponent(i, this.omComponents.getPosition_circle(2, this.circle_t), this.imgs[2], tt*om3x[i], tt*om3y[i], tt*om3r[i])
    this.renderOmComponent(i, this.omComponents.getPosition_circle(3, this.circle_t), this.imgs[3], tt*om4x[i], tt*om4y[i], tt*om4r[i])
    this.renderOmComponent(i, this.omComponents.getPosition_circle(4, this.circle_t), this.imgs[4], tt*om5x[i], tt*om5y[i], tt*om5r[i])
  }

  renderOmComponent(ind, offset, img, imgOffX, imgOffY, rot) {
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

    let lalax = 0;
    let lalay = 0;
    if (ind==0) {
      translate(correctPos.getX(), correctPos.getY());
      scale(p.zscale/correctPos.getZ());
    } else if (ind==1) {
      // translate(imgOffX, imgOffY)
      scale(p.zscale/correctPos.getZ());
      let lalala = correctPos.scalarmult(correctPos.getZ()/p.zscale)
      translate(lalala.getX()+imgOffX, lalala.getY()+imgOffY);
      // lalax = imgOffX/(p.zscale/correctPos.getZ())
      // lalay = imgOffY/(p.zscale/correctPos.getZ())
    }
    rotate(rot);
    // image(img, 0, 0);

    noStroke();
    noFill();
    // imageMode(CENTER);

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
      if (ind==0) {
        image(img, imgOffX, imgOffY);
      } else if (ind==1) {
        image(img, 0, 0);
      }
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

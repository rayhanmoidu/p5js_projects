class Entity {
  constructor(id, pos, m) {
    this.id = id;

    this.pos = pos;
    this.oldpos = pos;

    this.m = m;

    this.opacity = 0;
    this.prevOpacity = 0;

    this.timestep = 0.5;
    this.engine = new Engine(id, this, this.timestep);

    this.numComponents = 5;
    this.components = new EntityComponents(this.numComponents);

    this.imgs = coloredImgs[int(random(0, coloredImgs.length - 1))]

    // this.lalaoffset = 1;
    // this.time = 0;

    this.circle_t = 0;
    this.shifted_circle_t = 0;

    this.shape_index = 0;
    this.past_pi = false;
  }

  update() {
    this.engine.update();

    let mult = 1;
    if (opticalFlow > 7 && opticalFlow < 100) {
      mult = opticalFlow
    }

    let circleSpeed = (150/mult);

    let pidiff = ((PI - abs(PI - this.circle_t)) + 1) / PI;
    pidiff = pidiff;

    this.circle_t += abs(this.timestep*pidiff/circleSpeed);

    if (this.circle_t > 2*PI) {
      this.circle_t -= 2*PI;
      this.pastPi = false;
    }

    if (this.circle_t > PI && !this.pastPi) {
      this.pastPi = true;
      this.shape_index += 1;
      if (this.shape_index > 1) {
        this.shape_index = 0;
      }
    }
  }

  draw() {
    // let step = 150;
    // this.lalaoffset = sin(this.time/step)+1;

    let sct = (abs(PI - this.circle_t)) / PI;
    this.shifted_circle_t = sct;

    for (let i = 0; i < this.numComponents; i++) {
      this.renderComponent(shapes[this.shape_index], i, this.components.getOrbitPos(i, this.circle_t), this.imgs[i]);
    }
  }

  renderComponent(shape, ind, orbitPos, img) {
    // print(shape, ind, orbitPos, img)
    push();

    let pos = this.pos.add(orbitPos);

    // get max opacity based on degree to which the current shape is fulfilled
    // let maxOpacity = 255 - map(this.lalaoffset, 0, 2, 0, 100);
    let maxOpacity = 255 - map(this.shifted_circle_t, 0, 1, 100, 0);

    // get light source based on degree to which the current shape is fulfilled
    // let lightradius_adder = map(this.lalaoffset, 0, 2, 0, 100);
    let lightradius_adder = 100 - map(this.shifted_circle_t, 0, 1, 100, 0);
    let lightsource_radius = p.lr + lightradius_adder;

    // compute opacity based on distance to light sources
    let lightSourceOpacity = this.getLightSourceOpacity(pos, lightsource_radius);
    let depthOpacity = (1 - (pos.getZ()/p.zDepth));
    let computedOpacity = maxOpacity*lightSourceOpacity;
    this.opacity = this.getNewOpacity(computedOpacity)

    // render if non-transparent
    if (this.opacity > 0) {
      let shapeOffset = shape.getOffset(ind).scalarmult(this.shifted_circle_t);
      print(shape.shouldPreTranslate())

      // transform
      if (shape.shouldPreTranslate()) {
        translate(pos.getX(), pos.getY());
        scale(p.zscale/pos.getZ());
      } else {
        scale(p.zscale/pos.getZ());
        let scaledPos = pos.scalarmult(pos.getZ()/p.zscale)
        translate(scaledPos.getX()+shapeOffset.getX(), scaledPos.getY()+shapeOffset.getY());
      }
      rotate(shapeOffset.getZ());
      
      // render
      let finalOpacity = (this.opacity+this.prevOpacity)/2;
      noStroke();
      noFill();
      tint(255, 255, 255, finalOpacity)
      
      if (shape.shouldPreTranslate()) {
        image(img, shapeOffset.getX(), shapeOffset.getY());
      } else {
        image(img, 0, 0);
      }

      // this.prevOpacity = newOpacity;
      this.prevOpacity = finalOpacity;
    }

    pop();
  }

  // enforces lower limit on new opacity to ensure a slow fade out
  getNewOpacity(computedValue) {
    let retVal = 0;
    if (computedValue > this.opacity) {
      retVal = computedValue
    } else {
      if (computedValue >= this.opacity - p.ghostFade) {
        retVal = computedValue;
      } else {
        retVal = max(0, this.opacity - p.ghostFade);
      }
    }
    return retVal;
  }

  // computes lighting based on component position and all active light sources
  getLightSourceOpacity(pos, lightsource_radius) {
    // if want more accuracy, pos should be adjusted by curComponent offset
    let lightSourceOpacity = 0;
    for (let i = 0; i < lightSources.length; i++) {
      let posDiff = pos.subtract(lightSources[i]).length2()
      if (posDiff < lightsource_radius) {
        lightSourceOpacity += ((lightsource_radius - posDiff) / lightsource_radius);
      }
    }
    return min(lightSourceOpacity, 1);
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

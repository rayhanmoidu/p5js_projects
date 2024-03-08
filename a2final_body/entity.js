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


    this.components = new EntityComponents(5);

    this.imgs = coloredImgs[int(random(0, coloredImgs.length - 1))]

    // this.lalaoffset = 1;
    // this.time = 0;

    this.circle_t = 0;
    this.shifted_circle_t = 0;

    this.shapeshift_index = 0;
    this.past_pi = false;
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

    this.circle_t += abs(this.timestep*pidiff/circleSpeed);

    if (this.circle_t > 2*PI) {
      this.circle_t -= 2*PI;
      this.pastPi = false;
    }

    if (this.circle_t > PI && !this.pastPi) {
      this.pastPi = true;
      this.shapeshift_index += 1;
      if (this.shapeshift_index > 1) {
        this.shapeshift_index = 0;
      }
    }
  }

  draw() {
    // let step = 150;
    // this.lalaoffset = sin(this.time/step)+1;

    let i = this.shapeshift_index;

    let sct = (abs(PI - this.circle_t)) / PI;
    this.shifted_circle_t = sct;

    this.renderComponent(i, this.components.getPosition_circle(0, this.circle_t), this.imgs[0], sct*om1x[i], sct*om1y[i], sct*om1r[i])
    this.renderComponent(i, this.components.getPosition_circle(1, this.circle_t), this.imgs[1], sct*om2x[i], sct*om2y[i], sct*om2r[i])
    this.renderComponent(i, this.components.getPosition_circle(2, this.circle_t), this.imgs[2], sct*om3x[i], sct*om3y[i], sct*om3r[i])
    this.renderComponent(i, this.components.getPosition_circle(3, this.circle_t), this.imgs[3], sct*om4x[i], sct*om4y[i], sct*om4r[i])
    this.renderComponent(i, this.components.getPosition_circle(4, this.circle_t), this.imgs[4], sct*om5x[i], sct*om5y[i], sct*om5r[i])
  }

  renderComponent(ind, offset, img, imgOffX, imgOffY, rot) {
    push();

    let pos = this.pos.add(offset);

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

      // transform
      if (ind==0) {
        translate(pos.getX(), pos.getY());
        scale(p.zscale/pos.getZ());
      } else if (ind==1) {
        scale(p.zscale/pos.getZ());
        let scaledPos = pos.scalarmult(pos.getZ()/p.zscale)
        translate(scaledPos.getX()+imgOffX, scaledPos.getY()+imgOffY);
      }
      rotate(rot);
      
      // render
      let finalOpacity = (this.opacity+this.prevOpacity)/2;
      noStroke();
      noFill();
      tint(255, 255, 255, finalOpacity)
      
      if (ind==0) {
        image(img, imgOffX, imgOffY);
      } else if (ind==1) {
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

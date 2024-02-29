let ghostWidth = 375;
let ghostHeight = 666;

class Ghost {
  // local shape transforms
  // sscale = 0.1;
  // angle = 0.0;

  constructor(id, pos, shapeSVG) {
    this.curNoise = 0;
    this.id = id;
    this.pos = pos;
    this.shape = shapeSVG;

    this.dir = new Vec3(random(0, 0.45), random(0, 0.45), random(0, 0.1));
    this.dir = this.dir.normalize();

    this.bbox_w = ghostWidth;
    this.bbox_h = ghostHeight;
    this.bbox_z = 30;

    this.step = new Vec3(random(-1, 1), random(-1, 1), random(-0.1, 0.1));

    this.ghostGraphic = createGraphics(ghostWidth, ghostHeight);
    this.hasGraphic = false;
    // this.shapePNG.loadPixels();
    // for (let i = 0; i < ghostWidth; i++) {
    //   for (let j = 0; j < ghostHeight; j++) {
    //     print(this.shapePNG.get(i, j)[2])
    // // //     this.ghostGraphic.set(i, j, this.shapePNG.get(i, j));
    // //     print(this.shapePNG.get(0, 0))
    //   }
    // }
  }

  getPos() {
    return this.pos;
  }

  getID() {
    return this.id;
  }

  // setGraphicsObject() {
  //   ghostImg_png.loadPixels();
  //   // print(this.shapePNG)
  //   for (let i = 0; i < ghostWidth; i++) {
  //     for (let j = 0; j < ghostHeight; j++) {
  //       this.ghostGraphic.set(i, j, ghostImg_png.get(i, j));
  //     }
  //   }
  //   this.ghostGraphic.updatePixels();
  //   this.hasGraphic = true;
  // }

  update() {
    // print(this.dir);
    let dest = this.pos.add(this.dir);
    let newpos = this.pos.scalarmult(1-p.speed).add(dest.scalarmult(p.speed));

    let lightpos = new Vec3(p.lx, p.ly, p.lz);
    let d = this.pos.subtract(lightpos).length2();
    let alpha = (p.lr - d)/p.lr;
    let attractedpos = newpos;
    if (alpha>0) {
      alpha *= 0.2;
      attractedpos = this.pos.scalarmult(1-alpha).add(lightpos.scalarmult(alpha));
    }

    let finalpos = newpos.add(attractedpos).scalarmult(0.5);
    finalpos = attractedpos;

    this.applyWorldConstraints(finalpos);
    this.pos = finalpos;
    this.processCollisions();
    // print(this.pos)
    // this.perturbDir();
  }

  perturbDir() {
    this.curNoise += p.noiseFactor; 
    let dirNoise = noise(this.curNoise);
    this.dir = this.dir.add(this.dir.scalarmult(dirNoise))
    this.dir = this.dir.normalize();
  }

  applyWorldConstraints(newpos) {
    let xBuffer = 200;
    let yBuffer = 200;

    let zMax = 100;
    let zMin = 0.2;
    let xMax = width + xBuffer;
    let xMin = -xBuffer;
    let yMax = height + yBuffer;
    let yMin = -yBuffer;

    if (newpos.getZ() > zMax) {
      newpos.setZ(zMin);
    } else if (newpos.getZ() < zMin) {
      newpos.setZ(zMax);
    }
    if (newpos.getX() > xMax) {
      newpos.setX(xMin);
    } else if (newpos.getX() < xMin) {
      newpos.setX(xMax);
    }
    if (newpos.getY() > yMax) {
      newpos.setY(yMin);
    } else if (newpos.getY() < yMin) {
      newpos.setY(yMax);
    }

    // if (newpos.getZ() > zMax || newpos.getZ() < zMin) {
    //   this.dir.setZ(-this.dir.getZ());
    // }
    // if (newpos.getX() > xMax || newpos.getX() < xMin) {
    //   this.dir.setX(-this.dir.setX());
    // }
    // if (newpos.getY() > yMax || newpos.getY() < yMin) {
    //   this.dir.setY(-this.dir.setY());
    // }
  }

  processCollisions() {
    for (let i = 0; i < ghosts.length; i++) {
      let overlapPerc = this.getOverlap(ghosts[i]);
      // print(overlapPerc)
      if (overlapPerc > 0) {
        // print("OMGGG")
        let overlap = this.pos.subtract(ghosts[i].getPos());
        overlap = overlap.normalize();

        this.pos.setX(this.pos.getX() + overlapPerc*overlap.getX()*5);
        this.pos.setY(this.pos.getY() + overlapPerc*overlap.getY()*5);
        // this.pos.setZ(this.pos.getZ() + overlapPerc*overlap.getZ());
      }
    }
  }

  getOverlap(ghost) {
    if (this.id == ghost.getID()) {
      return 0;
    }

    let bbox_x = (this.pos.getZ() * p.bboxScale) * this.bbox_w;
    let bbox_y = (this.pos.getZ() * p.bboxScale) * this.bbox_h;
    let bbox_z = (this.pos.getZ() * p.bboxScale) * this.bbox_z;

    let dx = abs(this.pos.getX() - ghost.getPos().getX());
    let dy = abs(this.pos.getY() - ghost.getPos().getY());
    let dz = abs(this.pos.getZ() - ghost.getPos().getZ())

    if (dx < bbox_x && dy < bbox_y) {
      let percX = (bbox_x - dx) / bbox_x;
      let percY = (bbox_y - dy) / bbox_y;
      let percZ = (bbox_z - dz) / bbox_z;
      return percX*percY;
    }
    return 0;
  }

  // update() {
    // this.bbox_w = (this.sscale * p.shapeScale * p.bboxScale) * 1442;
    // this.bbox_h = (this.sscale * p.shapeScale * p.bboxScale) * 495;

    // let d = dist(mouseX, mouseY, this.x, this.y);

    // let diffx = mouseX - this.x;
    // let diffy = mouseY - this.x;
    // diffx /= d;
    // diffy /= d;

    // let newlocx = mouseX - diffx*(this.bbox_w/2);
    // let newlocy = mouseY - diffy*(this.bbox_h/2);

    // let speed = p.fishSpeed / frameRate()

    // this.x = (1-speed)*this.x + (speed)*newlocx;
    // this.y = (1-speed)*this.y + (speed)*newlocy;

    // for (let i = 0; i < agents.length; i++) {
    //   let overlapPerc = this.getOverlap(agents[i]);
    //   if (overlapPerc>0) {
    //     let overlapX = this.x - agents[i].getX();
    //     let overlapY = this.y - agents[i].getY();
    //     let dist = sqrt(overlapX*overlapX + overlapY*overlapY);
    //     overlapX /= dist;
    //     overlapY /= dist;
    //     this.x += overlapPerc*overlapX;
    //     this.y += overlapPerc*overlapY;
    //   }
    // }

    

  //   this.angle = degrees(atan2(mouseY - this.y, mouseX - this.x));

  //   // calculate distance from mouse to shape and use it to adjust scale
    
    
  // }

  draw() {
    // if (!this.hasGraphic) {
    //   this.setGraphicsObject();
    //   print("hi")
    // }
    // this.shapePNG.loadPixels();
    // print(this.shapePNG)
    push();
    translate(this.pos.getX(), this.pos.getY());
    scale(1/this.pos.getZ());
    // rotate(radians(this.angle));
    noStroke();
    noFill();
    imageMode(CENTER);
    // let s = this.sscale * p.shapeScale;
    // scale(s);
    // translate(p.shapeOffset, p.shapeOffset);


    let maxOpacity = 100;

    let depthOpacity = (1 - (this.pos.getZ()/100));

    let lightSource = new Vec3(p.lx, p.ly, p.lz);
    let posDiff = this.pos.subtract(lightSource).length2();
    let lightSourceOpacity = 0;
    // print(posDiff)
    if (posDiff < p.lr) {
      lightSourceOpacity = (p.lr - posDiff) / p.lr;
    }
    tint(255, 255, 255, maxOpacity*depthOpacity*lightSourceOpacity)

    image(this.shape, 0, 0);
    // image(this.ghostGraphic, 0, 0);
    // this.ghostGraphic.draw();
    // tint('red')
    pop();
  }
}

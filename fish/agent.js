class Agent {
  // agent centre and shape
  x;
  y;
  shape;

  // local shape transforms
  sscale = 0.1;
  angle = 0.0;

  constructor(x, y, shape, id) {
    this.id = id
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.bbox_w = (this.sscale * p.shapeScale) * 1442;
    this.bbox_h = (this.sscale * p.shapeScale) * 495;
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }

  getID() {
    return this.id;
  }

  getOverlap(agent2) {
    if (this.id == agent2.getID()) {
      return 0;
    }

    let dx = abs(this.x - agent2.getX());
    let dy = abs(this.y - agent2.getY());
    if (dx < this.bbox_w && dy < this.bbox_h) {
      let percX = (this.bbox_w - dx) / this.bbox_w;
      let percY = (this.bbox_h - dy) / this.bbox_h;
      return percX*percY;
    }
    return 0;
  }

  update() {
    this.bbox_w = (this.sscale * p.shapeScale * p.bboxScale) * 1442;
    this.bbox_h = (this.sscale * p.shapeScale * p.bboxScale) * 495;

    let d = dist(mouseX, mouseY, this.x, this.y);

    let diffx = mouseX - this.x;
    let diffy = mouseY - this.x;
    diffx /= d;
    diffy /= d;

    let newlocx = mouseX - diffx*(this.bbox_w/2);
    let newlocy = mouseY - diffy*(this.bbox_h/2);

    let speed = p.fishSpeed / frameRate()

    this.x = (1-speed)*this.x + (speed)*newlocx;
    this.y = (1-speed)*this.y + (speed)*newlocy;

    for (let i = 0; i < agents.length; i++) {
      let overlapPerc = this.getOverlap(agents[i]);
      if (overlapPerc>0) {
        let overlapX = this.x - agents[i].getX();
        let overlapY = this.y - agents[i].getY();
        let dist = sqrt(overlapX*overlapX + overlapY*overlapY);
        overlapX /= dist;
        overlapY /= dist;
        this.x += overlapPerc*overlapX;
        this.y += overlapPerc*overlapY;
      }
    }

    

    this.angle = degrees(atan2(mouseY - this.y, mouseX - this.x));

    // calculate distance from mouse to shape and use it to adjust scale
    
    
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    noStroke();
    noFill();
    imageMode(CENTER);
    let s = this.sscale * p.shapeScale;
    scale(s);
    // translate(p.shapeOffset, p.shapeOffset);
    
    image(this.shape, 0, 0);
    tint('red')
    pop();
  }
}

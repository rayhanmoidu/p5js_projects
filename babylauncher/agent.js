let myScale = 25;

class Agent {
    constructor(xPos, id) {
        this.id = id;
        this.x = xPos;
        this.y = -1000;
        this.a = 0;

        this.bbox_h = 800*2;
        this.bbox_w = 800*2;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
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
        // print(dx, dy)
        if (dx < this.bbox_w && dy < this.bbox_h) {
            // print("HELLO")
          let percX = (this.bbox_w - dx) / this.bbox_w;
          let percY = (this.bbox_h - dy) / this.bbox_h;
          return percX*percY;
        }
        return 0;
      }

    update() {
        if (this.y <= height*22) {
            this.a += 0.1;
            this.y += this.a;
        }
        

        for (let i = 0; i < agents.length; i++) {
            let overlapPerc = this.getOverlap(agents[i]);
            if (overlapPerc>0) {
                let overlapX = this.x - agents[i].getX();
                let overlapY = this.y - agents[i].getY();
                let dist = sqrt(overlapX*overlapX + overlapY*overlapY);
                overlapX /= dist;
                overlapY /= dist;
                this.x += overlapPerc*overlapX;
                this.y -= overlapPerc*overlapY;
            }
        }
    }

    draw() {
        if (this.id==10) {
            print(this.x)
        }
        push();
        // noStroke();
        // fill(255, 0, 0);
        // circle(this.x, this.y, 4);
        scale(1/myScale);
        image(babyimg, this.x, this.y)
        pop();
    }
}
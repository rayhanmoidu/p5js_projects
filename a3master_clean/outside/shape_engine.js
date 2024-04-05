class ShapeEngine {
    constructor(id, shape, slopesign, dir_theta, dir) {
        this.dir = dir;
        this.dir_theta = dir_theta;
        this.slopesign = slopesign;

        this.tinc = 0;
        this.isShapeMode = false;
        this.hitShape = false;
        this.shapeStart = -1;
        this.Sdir = -1*slopesign;
        this.numcycles = 0;
        this.numcyclescomplete = 0;
        this.alreadyTickedCycle = false;

        // s/o determination
        this.should_o = shape == "o";
        this.should_s = shape == "s";

        // set angle offset for shape
        if (this.should_o) {
            if (this.slopesign > 0) {
                this.t = dir_theta;
            } else {
                this.t = PI - dir_theta;
            }
        } else if (this.should_s) {
            if (this.slopesign > 0) {
                this.t = (PI/2) + dir_theta;
            } else {
                this.t = (PI/2) - dir_theta;
            }
        }

        // set hill-dependent information: shapeStart [0, 1], and circleRadius
        if (id == 0) {
            this.shapeStart = random(0.15, 0.2);
            this.circleR = random(50, 60)
        } else if (id == 1) {
            this.shapeStart = random(0.3, 0.4)
            this.circleR = random(40, 50)
        } else {
            this.shapeStart = random(0.4, 0.5)
            this.circleR = random(25, 35)
        }
    }

    getShapeStart() {
        return this.shapeStart;
    }

    getHead() {
        if (this.should_o) {
            return this.getHead_O();
        } else if (this.should_s) {
            return this.getHead_S();
        }
    }

    isComplete() {
        if (this.should_o) {
            return this.isComplete_O();
        } else if (this.should_s) {
            return this.isComplete_S();
        }
    }

    isComplete_O() {
        if (this.numcyclescomplete == this.numcycles) {
            this.numcyclescomplete = 0;
            this.tinc = 0;
            this.isShapeMode = false;
            this.dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
            return 2;
        } else {
            return 0;
        }
    }

    isComplete_S() {
        let fact = this.tinc / (2*PI);
        if (this.Sdir==1 && fact > 0.5) {
            // print(this.S)
            this.Sdir *= -1;
            this.tinc = 0;
            return 1;
        } else if (this.Sdir==-1 && fact < -0.5) {
            this.tinc = 0;
            this.isShapeMode = false;
            return 2;
        }
        return 0;
    }

    getHead_O(oldhead) {
        let perp_dir = new Vec2(-this.dir.getY(), this.dir.getX());
        let circle_center = oldhead.add(perp_dir.scalarmult(-this.slopesign*this.circleR));

        let posOnCircle = circle_center.add(new Vec2(-this.circleR * cos(this.t+ -this.slopesign*this.tinc), -this.circleR * sin(this.t+ -this.slopesign*this.tinc)));
        this.head = posOnCircle

        // dont do +=, set it equal to the 
        let curpos = this.personas[0].getPos().subtract(circle_center);
        let startpos = oldhead.subtract(circle_center);
        let theta = acos(curpos.dot(startpos)/(curpos.length2()*startpos.length2()));

        if (this.slopesign > 0) {
            theta = atan2(curpos.det(startpos), curpos.dot(startpos))
        } else {
            theta = atan2(startpos.det(curpos), startpos.dot(curpos))
        }
        // theta = atan2(startpos.det(curpos), startpos.dot(curpos))
        this.tinc = theta + s.personaDist*this.scale/(this.circleR);

        let fact = this.tinc / (2*PI);
        if (!this.alreadyTickedCycle && fact < 0 && fact > -0.05) {
            this.numcyclescomplete += 1;
            this.alreadyTickedCycle = true;
        }
        if (this.alreadyTickedCycle && fact > 0) {
            this.alreadyTickedCycle = false;
        }

        if (this.numcyclescomplete == this.numcycles) {
            this.numcyclescomplete = 0;
            this.tinc = 0;
            this.isShapeMode = false;
            this.dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
        }
    }

    getHead_S(oldhead) {
        let perp_dir = new Vec2(-this.dir.getY(), this.dir.getX());
        let circle_center = oldhead.add(this.dir.normalize().scalarmult(this.circleR))

        let posOnCircle = circle_center.add(new Vec2(-this.circleR * cos(this.t + -this.slopesign*this.tinc), -this.circleR * sin(this.t + -this.slopesign*this.tinc)));
        this.head = posOnCircle

        // print(this.head, this.t + this.slopesign*this.tinc)

        // dont do +=, set it equal to the 
        let curpos = this.personas[0].getPos().subtract(circle_center);
        let startpos = oldhead.subtract(circle_center);
        let theta = acos(curpos.dot(startpos)/(curpos.length2()*startpos.length2()));

        if (this.slopesign > 0) {
            theta = atan2(curpos.det(startpos), curpos.dot(startpos))
        } else {
            theta = atan2(startpos.det(curpos), startpos.dot(curpos))
        }
        // print(this.id, theta)
        // theta = atan2(startpos.det(curpos), startpos.dot(curpos))
        this.tinc = theta + this.Sdir*s.personaDist*this.scale/(this.circleR);
        // print("this.tinc", this.tinc)

        let fact = this.tinc / (2*PI);
        if (this.Sdir==1 && fact > 0.5) {
            // print(this.S)
            this.oldhead = this.personas[0].getPos();
            this.Sdir *= -1;
            this.tinc = 0;
        } else if (this.Sdir==-1 && fact < -0.5) {
            this.tinc = 0;
            this.isShapeMode = false;
            this.dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
        }
    }
}
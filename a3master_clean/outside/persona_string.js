class PersonaString {
    constructor(id, scale, startpos, endpos) {

        this.id = id;
        this.scale = scale;

        // position
        this.startpos = startpos;
        this.endpos = endpos;

        // direction
        this.diff = endpos.subtract(startpos);
        this.dir = this.diff.normalize();

        this.slope = this.dir.getY() / this.dir.getX();
        this.slopesign = this.slope / abs(this.slope);

        let up = new Vec2(0, 1);
        this.dir_theta = acos(this.dir.dot(up)/(this.dir.length2()*up.length2()));
        
        // personas
        this.numPersonas = int(random(10, 30));
        this.numComplete = 0;

        this.personas = [];
        for (let i = 0; i < this.numPersonas; i++) {
            // line personas up opposite to dir
            let pos = startpos.add(this.dir.scalarmult(-i * s.personaDist*scale));
            let newpersona = new Persona(this.id, pos, scale, endpos);
            this.personas.push(newpersona);
        }

        // head
        this.head = this.personas[0].getPos()
        this.oldhead = new Vec2(0, 0)

        // s and o shapes
        this.initShapeVariables();
    }

    update() {
        if (!this.hitShape) { // if haven't begun shape yet

            // if past shapeStart, begin shape
            if (this.head.subtract(this.startpos).length2() > this.diff.length2()*this.shapeStart) {
                this.isShapeMode = true;
                this.hitShape = true;
                this.oldhead = this.head;
            }
        }

        // update each persona's direction to head in
        this.updateDirections();

        // signal to caller that string is complete when all personas have vanished
        return this.numComplete == this.numPersonas;
    }

    // draws each persona
    draw(graphicsObject) {
        for (let i = 0; i < this.personas.length; i++) {
            this.personas[i].draw(graphicsObject, 0);
        }
    }

    updateDirections() {
        if (this.personas.length) {

            // move head
            if (this.isShapeMode && this.should_o) { // circle shape
                this.moveHead_O();
            } else if (this.isShapeMode && this.should_s) { // S shape
                this.moveHead_S();
            } else { // linear path
                this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.personaDist*this.scale));
            }

            // assign head as newDestination for leading persona, then update and increment if persona vanished
            this.personas[0].assignNewDestination(this.head);
            this.numComplete += this.personas[0].update();

            // assign person in front as newDestination for all other personas, then update and increment if persona vanished
            for (let i = 1; i < this.personas.length; i++) {
                this.personas[i].assignNewDestination(this.personas[i-1].getPos());
                this.numComplete += this.personas[i].update();
            }
        }
    }

    // moves the head in an S shape
    moveHead_S() {

        // center of circle is along dir
        let circle_center = this.oldhead.add(this.dir.normalize().scalarmult(this.circleR))

        // use theta to compute new position in S, then set head
        let new_t = this.t - this.slopesign*this.t_inc
        let posOnCircle = circle_center.add(new Vec2(-this.circleR * cos(new_t), -this.circleR * sin(new_t)));
        this.head = posOnCircle

        // adjust theta
        this.setT_inc(this.Sdir, circle_center)

        // turning and stopping conditions for S
        let fact = this.t_inc / (2*PI);
        if (this.Sdir==1 && fact > 0.5) {
            this.oldhead = this.personas[0].getPos();
            this.Sdir *= -1;
            this.t_inc = 0;
        } else if (this.Sdir==-1 && fact < -0.5) {
            this.t_inc = 0;
            this.isShapeMode = false;
            this.dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
        }
    }

    // moves the head in an O shape
    moveHead_O() {

        // center of circle is along perpendicular dir
        let perp_dir = new Vec2(-this.dir.getY(), this.dir.getX());
        let circle_center = this.oldhead.add(perp_dir.scalarmult(-this.slopesign*this.circleR));

        // use theta to compute new position along O, then set head
        let new_t = this.t - this.slopesign*this.t_inc;
        let posOnCircle = circle_center.add(new Vec2(-this.circleR * cos(new_t), -this.circleR * sin(new_t)));
        this.head = posOnCircle

        // adjust theta
        this.setT_inc(1, circle_center);

        // keep track of numCycles completed
        let fact = this.t_inc / (2*PI);
        if (!this.alreadyTickedCycle && fact < 0 && fact > -0.05) {
            this.numcyclescomplete += 1;
            this.alreadyTickedCycle = true;
        }
        if (this.alreadyTickedCycle && fact > 0) {
            this.alreadyTickedCycle = false;
        }

        // stopping condition for O
        if (this.numcyclescomplete == this.numcycles) {
            this.numcyclescomplete = 0;
            this.t_inc = 0;
            this.isShapeMode = false;
            this.dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
        }
    }

    // increments theta during shape
    setT_inc(mult, circle_center) {

        // compute how much of shape the leading persona has covered from startpos, as angle theta
        let curpos = this.personas[0].getPos().subtract(circle_center);
        let startpos = this.oldhead.subtract(circle_center);
        let theta = acos(curpos.dot(startpos)/(curpos.length2()*startpos.length2()));

        if (this.slopesign > 0) {
            theta = atan2(curpos.det(startpos), curpos.dot(startpos))
        } else {
            theta = atan2(startpos.det(curpos), startpos.dot(curpos))
        }

        // rotate theta to cover circumference distance equal to stepsize during linear motion
        this.t_inc = theta + mult*s.personaDist*this.scale/(this.circleR);
    }

    // initialized many variables for shape motion
    initShapeVariables() {
        this.t_inc = 0;

        this.isShapeMode = false;
        this.hitShape = false;

        // for S only
        this.Sdir = -1*this.slopesign;

        // for O only
        this.numcycles = int(random(2, 4));
        this.numcyclescomplete = 0;
        this.alreadyTickedCycle = false;

        // s/o determination
        let randfactor = random(0, 1);

        if (randfactor < 0.3) {
            this.should_o = true;
        } else {
            this.should_s = true;
        }

        // set angle offset for shape
        if (this.should_o) {
            if (this.slopesign > 0) {
                this.t = this.dir_theta;
            } else {
                this.t = PI - this.dir_theta;
            }
        } else if (this.should_s) {
            if (this.slopesign > 0) {
                this.t = (PI/2) + this.dir_theta;
            } else {
                this.t = (PI/2) - this.dir_theta;
            }
        }

        // set hill-dependent information: shapeStart [0, 1], and circleRadius
        if (this.id == 0) {
            this.shapeStart = random(0.15, 0.2);
            this.circleR = random(50, 60)
        } else if (this.id == 1) {
            this.shapeStart = random(0.3, 0.4)
            this.circleR = random(40, 50)
        } else {
            this.shapeStart = random(0.4, 0.5)
            this.circleR = random(25, 35)
        }
    }

}
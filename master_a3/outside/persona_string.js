class PersonaString {
    constructor(id, hill, scale, startpos, endpos) {

        this.id = id;
        this.hill = hill;

        this.scale = scale;

        this.startpos = startpos;
        this.endpos = endpos;
        this.diff = endpos.subtract(startpos);
        this.dir = this.diff.normalize();

        this.numcycles = 0;
        this.numcyclescomplete = 0;
        this.alreadyTickedCycle = false;

        this.slope = this.dir.getY() / this.dir.getX();
        this.slopesign = this.slope / abs(this.slope);

        let up = new Vec2(0, 1);
        this.dir_theta = acos(this.dir.dot(up)/(this.dir.length2()*up.length2()));

        if (this.slopesign > 0) {
            this.t = this.dir_theta;
        } else {
            this.t = PI - this.dir_theta;
        }
        this.tinc = 0;

        this.numPersonas = int(random(10, 30));
        this.numComplete = 0;

        this.personas = [];
        for (let i = 0; i < this.numPersonas; i++) {
            let pos = startpos.add(this.dir.scalarmult(-i * s.personaDist*scale));
            let newpersona = new Persona(this.id, hill, pos, scale, endpos);
            this.personas.push(newpersona);
        }

        this.head = this.personas[0].getPos()
        this.oldhead = new Vec2(0, 0)

        this.isCircleMode = false;
        this.hitCircle = false;

        this.circleStart = -1;

        this.SStep = 10;

        if (random(0, 1) > 0.2) {
            if (this.id == 0) {
                this.circleStart = random(0.25, 0.3);
                this.circleR = random(50, 80)
            } else if (this.id == 1) {
                this.circleStart = random(0.3, 0.7)
                this.circleR = random(35, 50)
            } else {
                this.circleStart = random(0.4, 0.7)
                this.circleR = random(25, 35)
            }
        }

        this.addedstring = false;

        this.offset_t = 1;

        // this.circleStart = random(0.1, 0.6);

        // this.circleR = random(200, 300) * this.scale;

        // this.head = startpos.add(this.dir.scalarmult(s.stepSize));
        // this.updateDirections();


    }

    update() {
        if (!this.hitCircle) {
            if (this.head.subtract(this.startpos).length2() > this.diff.length2()*this.circleStart) {
                this.isCircleMode = true;
                this.hitCircle = true;
                this.oldhead = this.head;
                this.numcycles = int(random(3, 7))
            }
        }

        // if (this.getPercAlongPath > 0.6 && !this.addedstring) {
        //     world_outside.addString(this.id);
        //     this.addedstring = true;
        // }

        // this.t = min(this.t, 1);

        // this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.stepSize));
        this.updateDirections();

        return this.numComplete == this.numPersonas;
    }

    shouldAddNew() {
        if (this.getPercAlongPath > 0.6 && !this.addedstring) {
            // world_outside.addString(this.id);
            this.addedstring = true;
            return true;
        }
    }

    getPercAlongPath() {
        let diff = this.head.getX() - this.startpos.getX();
        return diff / (this.endpos.getX() - this.startpos.getX());
    }

    draw(graphicsObject) {
        for (let i = 0; i < this.personas.length; i++) {
            this.personas[i].draw(graphicsObject, this.offset_t);
        }

        graphicsObject.fill(255)
        graphicsObject.circle(this.endpos.getX(), this.endpos.getY(), 10);
    }

    updateDirections() {
        if (this.personas.length) {

            if (this.isCircleMode) {
                this.offset_t -= 0.005;
                this.offset_t = max(0, this.offset_t);

                let perp_dir = new Vec2(-this.dir.getY(), this.dir.getX());
                let circle_center = this.oldhead.add(perp_dir.scalarmult(-this.slopesign*this.circleR));

                let posOnCircle = circle_center.add(new Vec2(-this.circleR * cos(this.t+ -this.slopesign*this.tinc), -this.circleR * sin(this.t+ -this.slopesign*this.tinc)));
                this.head = posOnCircle

                // dont do +=, set it equal to the 
                let curpos = this.personas[0].getPos().subtract(circle_center);
                let startpos = this.oldhead.subtract(circle_center);
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
                    this.isCircleMode = false;
                    this.dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
                }
            } else if (this.SMode) {
                this.offset_t -= 0.005;
                this.offset_t = max(0, this.offset_t);

                let perp_dir = new Vec2(-this.dir.getY(), this.dir.getX());
                let circle_center = this.oldhead.add(dir.scalarmult(this.SStep)).add(perp_dir.scalarmult(-this.slopesign*this.circleR));

            } else {
                this.offset_t += 0.005;
                this.offset_t = min(1, this.offset_t);

                
                // let dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
                this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.personaDist*this.scale));
                // print(this.head)
            }

            // this.head = new Vec2(random(0, 10), random(0, 10));
            // print(this.id, this.head)

            this.personas[0].assignNewDestination(this.head);
            this.numComplete += this.personas[0].update();
            if (this.id==0) {
                // print(this.numComplete)
            }
            for (let i = 1; i < this.personas.length; i++) {
                this.personas[i].assignNewDestination(this.personas[i-1].getPos());
                this.numComplete += this.personas[i].update();
            }
        }
    }


}
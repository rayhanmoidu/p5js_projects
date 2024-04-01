class PersonaString {
    constructor(id, scale, startpos, endpos) {

        this.id = id;

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
            let newpersona = new Persona(pos, scale, endpos);
            this.personas.push(newpersona);
        }

        this.head = this.personas[0].getPos()
        this.oldhead = new Vec2(0, 0)

        this.isCircleMode = false;
        this.hitCircle = false;

        // this.head = startpos.add(this.dir.scalarmult(s.stepSize));
        // this.updateDirections();


    }

    update() {
        if (!this.hitCircle && s.gocircle) {
            this.isCircleMode = true;
            this.hitCircle = true;
            this.oldhead = this.head;
            this.numcycles = int(random(1, 2))
        }

        // this.t = min(this.t, 1);

        // this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.stepSize));
        this.updateDirections();

        return this.numComplete == this.numPersonas;
    }

    draw(graphicsObject) {
        for (let i = 0; i < this.personas.length; i++) {
            this.personas[i].draw(graphicsObject);
        }
        // fill(255)
        // circle(this.head.getX(), this.head.getY(), 10);
    }

    updateDirections() {
        if (this.personas.length) {

            if (this.isCircleMode) {
                let perp_dir = new Vec2(-this.dir.getY(), this.dir.getX());
                let circle_center = this.oldhead.add(perp_dir.scalarmult(-this.slopesign*s.circleR));

                let posOnCircle = circle_center.add(new Vec2(-s.circleR * cos(this.t+ -this.slopesign*this.tinc), -s.circleR * sin(this.t+ -this.slopesign*this.tinc)));
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
                this.tinc = theta + s.personaDist*this.scale/(s.circleR);

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
            } else {
                // let dir = this.endpos.subtract(this.personas[0].getPos()).normalize();
                this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.personaDist*this.scale));
                // print(this.head)
            }

            // this.head = new Vec2(random(0, 10), random(0, 10));
            // print(this.id, this.head)

            this.personas[0].assignNewDestination(this.head);
            this.numComplete += this.personas[0].update();
            for (let i = 1; i < this.personas.length; i++) {
                this.personas[i].assignNewDestination(this.personas[i-1].getPos());
                this.numComplete += this.personas[i].update();
            }
        }
    }


}
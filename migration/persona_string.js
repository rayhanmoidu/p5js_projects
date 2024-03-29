class PersonaString {
    constructor(id, scale, startpos, endpos) {

        // this.time = 0;

        // this.dir = new Vec2(endpos.getX() - startpos.getX(), endpos.getY() - startpos.getY());
        // this.dir = this.dir.normalize();

        this.id = id;

        this.scale = scale;

        this.startpos = startpos;
        this.endpos = endpos;
        this.diff = endpos.subtract(startpos);
        this.dir = this.diff.normalize();

        this.slope = this.dir.getY() / this.dir.getX();
        this.slopesign = this.slope / abs(this.slope);

        let up = new Vec2(0, 1);
        this.dir_theta = acos(this.dir.dot(up)/(this.dir.length2()*up.length2()));
        this.t = PI + this.slopesign*this.dir_theta;
        this.tinc = 0;

        this.numPersonas = int(random(10, 30));
        this.numComplete = 0;

        this.personas = [];
        for (let i = 0; i < this.numPersonas; i++) {
            let pos = startpos.add(this.dir.scalarmult(-i * s.personaDist*scale));
            let newpersona = new Persona(pos, scale, endpos);
            this.personas.push(newpersona);
        }

        this.head = new Vec2(0, 0)
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
        }

        // this.t = min(this.t, 1);

        // this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.stepSize));
        this.updateDirections();

        return this.numComplete == this.numPersonas;
    }

    draw() {
        for (let i = 0; i < this.personas.length; i++) {
            this.personas[i].draw();
        }
        fill(255)
        circle(this.head.getX(), this.head.getY(), 10);
    }

    updateDirections() {
        if (this.personas.length) {

            if (this.isCircleMode) {

                // this.t += s.personaDist*this.scale/(s.circleR*75);
                // let up = new Vec2(0, 1);
                // let dir_theta = PI - acos(this.dir.dot(up)/(this.dir.length2()*up.length2()));

                let perp_dir = new Vec2(-this.dir.getY(), this.dir.getX());
                let circle_center = this.oldhead.add(perp_dir.scalarmult(s.circleR));

                fill(255, 0, 0);
                circle(circle_center.getX(), circle_center.getY(), 10);

                // print(dir_theta)

                let posOnCircle = circle_center.add(new Vec2(-s.circleR * cos(this.t+this.tinc), -s.circleR * sin(this.t+this.tinc)));
                // let rotatedPos = new Vec2(posOnCircle.getX() * cos(dir_theta) - posOnCircle.getY() * sin(dir_theta), posOnCircle.getY() * sin(dir_theta) + posOnCircle.getX() * cos(dir_theta))

                this.head = posOnCircle

                this.tinc += s.personaDist*this.scale/(s.circleR*75);

                // this.head = new Vec2(this.oldhead.getX() - s.circleR * cos(this.t), this.oldhead.getY() + s.circleR * sin(this.t));
                // print(this.id, this.head, this.t)
                if (this.tinc > 2*PI) {
                    this.tinc = 0;
                    this.isCircleMode = false;
                }
            } else {
                this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.personaDist*this.scale));
                print(this.head)
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
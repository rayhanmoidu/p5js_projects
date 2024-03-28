class PersonaString {
    constructor(scale, startpos, endpos) {

        // this.time = 0;

        // this.dir = new Vec2(endpos.getX() - startpos.getX(), endpos.getY() - startpos.getY());
        // this.dir = this.dir.normalize();

        this.startpos = startpos;
        this.endpos = endpos;
        this.diff = endpos.subtract(startpos);
        this.dir = this.diff.normalize();
        this.t = 1;

        this.numPersonas = random(10, 30);

        this.personas = [];
        for (let i = 0; i < this.numPersonas; i++) {
            let pos = startpos.add(this.dir.scalarmult(-i * s.personaDist*scale));
            let newpersona = new Persona(pos, scale, endpos);
            this.personas.push(newpersona);
        }

        // this.head = startpos.add(this.dir.scalarmult(s.stepSize));
        this.updateDirections();


    }

    update() {
        this.t += s.stepSize;
        this.t = min(this.t, 1);

        // this.head = this.personas[0].getPos().add(this.dir.scalarmult(s.stepSize));
        this.updateDirections();
    }

    draw() {
        for (let i = 0; i < this.personas.length; i++) {
            this.personas[i].draw();
        }
    }

    updateDirections() {
        if (this.personas.length) {
            this.head = this.startpos.add(this.diff.scalarmult(this.t));

            this.personas[0].assignNewDestination(this.head);
            this.personas[0].update(this.personas);
            for (let i = 1; i < this.personas.length; i++) {
                this.personas[i].assignNewDestination(this.personas[i-1].getPos());
                this.personas[i].update(this.personas);
            }
        }
    }


}
class StringFactory {
    constructor(hills) {

        this.hills = hills;
        this.time = 0;

    }

    update(personaStrings) {
        // random chance to produce a string for any hill
        if (this.time==0) {
            personaStrings.push(this.createString(0));
        }

        this.time += 0.1;

    }

    createString(hillId) {
        let hill = this.hills[hillId];
        let vertices = hill.getVertices();

        let maxX = hill.getBaseWidth();
        let startX = random(0, maxX);
        let percX = startX / maxX;

        let startpos = new Vec2(startX, height + 50);
        let destpos = this.getDestPos(vertices, percX);

        return new PersonaString(hill.getScale(), startpos, destpos);
    }

    getDestPos(vertices, percX) {
        let pos1 = new Vec2(0, 0);
        let pos2 = new Vec2(0, 0);
        while (pos2.subtract(pos1).length2() == 0) {
            let ind = 0;
            if (percX > 0.5) {
                ind = int(random(1, vertices.length/2));
            } else {
                ind = int(random(vertices.length/2, vertices.length-1));
            }

            pos1 = vertices[ind - 1];
            pos2 = vertices[ind];
        }

        return pos1.add(pos2.subtract(pos1).scalarmult(random(0, 1)));
    }
}
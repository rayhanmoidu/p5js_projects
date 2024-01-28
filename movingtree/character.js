class Character {
    // pos should be the center of the head
    constructor(pos, dir) {
        this.pos = pos;
        this.dress = new Cloth("dress", pos.add(new Vec2(0, 50)), p.dressHeight, p.dressWidth, -dir, p.dressHeight / 6);
        this.hair = new Hair("head", pos, 25);
        this.springs = this.dress.getSprings().concat(this.hair.getSprings());
        this.particles = this.dress.getParticles().concat(this.hair.getParticles());
    }

    render() {
        push();
        fill(156, 115, 87);
        stroke(156, 115, 87);
        strokeWeight(5);
        circle(this.pos.getX(), this.pos.getY(), 50);
        line(this.pos.getX(), this.pos.getY(), this.pos.getX(), this.pos.getY() + 50);
        pop();

        this.hair.render();
        this.dress.render();
    }

    getSprings() {
        return this.springs;
    }

    getParticles() {
        return this.particles;
    }


}
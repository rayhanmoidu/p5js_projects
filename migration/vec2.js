class Vec2 {
    // Vectors with 2 dimensions, along with associated methods
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    length2() {
        return sqrt(this.x*this.x + this.y*this.y);
    }

    add(pos) {
        return new Vec2(this.x + pos.getX(), this.y + pos.getY());
    }

    subtract(pos) {
        return new Vec2(this.x - pos.getX(), this.y - pos.getY());
    }

    dot(pos) {
        return this.x*pos.x + this.y*pos.y;
    }

    scalarmult(val) {
        return new Vec2(this.x*val, this.y*val);
    }

    normalize() {
        let l = this.length2();
        return new Vec2(this.x / l, this.y / l);
    }
}
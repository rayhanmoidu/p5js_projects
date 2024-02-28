class Vec3 {    
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getZ() {
        return this.z;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setZ(z) {
        this.z = z;
    } 

    length2() {
        return sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }

    add(pos) {
        return new Vec3(this.x + pos.getX(), this.y + pos.getY(), this.z + pos.getZ());
    }

    subtract(pos) {
        return new Vec3(this.x - pos.getX(), this.y - pos.getY(), this.z - pos.getZ());
    }

    dot(pos) {
        return this.x*pos.x + this.y*pos.y + this.z*pos.z;
    }

    scalarmult(val) {
        return new Vec3(this.x*val, this.y*val, this.z*val);
    }

    normalize() {
        let l = this.length2();
        return new Vec3(this.x / l, this.y / l, this.z / l); 
    }
}
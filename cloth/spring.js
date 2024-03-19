class Spring {
    constructor(id, ep1, ep2, r, ks, kd) {
        this.r = r;
        this.ks = ks;
        this.kd = kd;
        this.id = id;
        this.ep1 = ep1;
        this.ep2 = ep2;
    }

    getID() {
        return this.id;
    }

    getR() {
        return this.r;
    }

    getKs() {
        return this.ks;
    }

    getKd() {
        return this.kd;
    }

    getEndpoints() {
        return [this.ep1, this.ep2];
    }

}
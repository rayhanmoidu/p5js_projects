class Spring {
    constructor(id, se1, se2, r, ks, kd) {
        this.id = id;
        this.se1 = se1;
        this.se2 = se2;
        this.r = r;
        this.ks = ks;
        this.kd = kd;
    }

    getEndpoints() {
        return [this.se1, this.se2];
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
}
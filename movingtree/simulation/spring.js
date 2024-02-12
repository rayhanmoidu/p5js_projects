class Spring {
    // Spring object, contains 2 spring endpoints and spring information
    
    constructor(id, se1, se2, r, ks, kd, level) {
        this.id = id;
        this.level = level;

        // endpoints
        this.se1 = se1;
        this.se2 = se2;

        // spring information
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

    getLevel() {
        return this.level;
    }
}
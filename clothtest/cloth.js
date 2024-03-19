class Cloth {
    constructor() {
        this.springs = [];
        this.springEndpoints = [];
        this.fixedIds = [];

        this.createCloth();
    }

    createCloth() {
        let ep1 = new SpringEndpoint(0, new Vec3(50, 400, 0), 50);
        let ep2 = new SpringEndpoint(1, new Vec3(550, 400, 0), 50);
        let s = new Spring(0, ep1, ep2, 500, 15000, 0.05);

        this.springs = [s];
        this.springEndpoints = [se1, se2];
        this.fixedIds = [];
    }

    getSprings() {
        return this.springs;
    }

    getSpringEndpoints() {
        return this.springEndpoints;
    }

    getFixedIds() {
        return this.fixedIds;
    }
}
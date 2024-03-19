class Cloth {
    constructor() {
        this.springs = [];
        this.springEndpoints = [];
        this.fixedIds = [];

        this.createCloth();
    }

    draw() {
        push();

        fill(255, 0, 0);
        for (let i = 0; i < this.springEndpoints.length; i++) {
            push();

            // if (i==1) {
            //     fill(255, 255, 0);
            // }

            let curpos = this.springEndpoints[i].getPos();
            // translate(curpos.getX(), curpos.getY(), curpos.getZ());
            circle(curpos.getX(), curpos.getY(), 5);
            // circle(5);

            pop();
        }

        pop();
    }

    createCloth() {
        let ep1 = new SpringEndpoint(0, new Vec3(50, 400, 0), 500);
        let ep2 = new SpringEndpoint(1, new Vec3(550, 400, 0), 500);
        let s = new Spring(0, ep1, ep2, 400, 15000, 0.05);

        this.springs = [s];
        this.springEndpoints = [ep1, ep2];
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
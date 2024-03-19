class PhysicsCalculator {
    constructor() {
    }

    // calculate spring force between 2 particles
    computeSpringForce(s) {
        let endpoints = s.getEndpoints();
        let se1 = endpoints[0];
        let se2 = endpoints[1];
        let r = s.getR();
        let ks = s.getKs();

        let posdiff = se1.getPos().subtract(se2.getPos());

        print("hi", posdiff)

        let d_xy = sqrt(posdiff.getX()*posdiff.getX() + posdiff.getY()*posdiff.getY());
        let d = posdiff.length2();

        let f = ks * (abs(d)/r - 1);

        let theta = atan(abs(posdiff.getY()) / abs(posdiff.getX()));
        let phi = atan(abs(posdiff.getZ()) / d_xy);

        let fx = f * cos(theta);
        let fy = f * sin(theta);
        let fz = f * sin(phi);

        let dirx = -posdiff.getX() / abs(posdiff.getX());
        let diry = -posdiff.getY() / abs(posdiff.getY());
        let dirz = -posdiff.getZ() / abs(posdiff.getZ());

        let finalx = posdiff.getX() == 0 ? 0 : fx * dirx;
        let finaly = posdiff.getY() == 0 ? 0 : fy * diry;
        let finalz = posdiff.getZ() == 0 ? 0 : fz * dirz;

        return new Vec3(finalx, finaly, finalz);
    }

    // calculate spring damping force between 2 particles
    computeDampingForce(s) {
        let endpoints = s.getEndpoints();
        let se1 = endpoints[0];
        let se2 = endpoints[1];
        let r = s.getR();
        let kd = s.getKd();

        let vdiff = se1.getVelocity().subtract(se2.getVelocity());
        vdiff = vdiff.scalarmult(1/r);

        let posdiff = se1.getPos().subtract(se2.getPos());
        let dirx = -posdiff.getX() / abs(posdiff.getX());
        let diry = -posdiff.getY() / abs(posdiff.getY());
        let dir = new Vec2(dirx, diry);

        let dotres = vdiff.dot(dir);
        let finalforce = dir.scalarmult(kd*dotres);
        return finalforce;
    }
}
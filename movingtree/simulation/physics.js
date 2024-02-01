class PhysicsCalculator {
    constructor() {
    }

    // calculate spring force between 2 particles
    calculateSpringForce(se1, se2, r, ks) {
        let posdiff = se1.getPos().subtract(se2.getPos());
        let d = sqrt(posdiff.getX()*posdiff.getX() + posdiff.getY()*posdiff.getY());

        let f_scalar = ks * (d/r - 1);
        let theta = atan(abs(posdiff.getY()) / abs(posdiff.getX()));

        let fx = f_scalar * cos(theta)
        let fy = f_scalar * sin(theta);
        let dirx = -posdiff.getX() / abs(posdiff.getX());
        let diry = -posdiff.getY() / abs(posdiff.getY());

        let final_x = posdiff.getX() == 0 ? 0 : dirx * fx;
        let final_y = posdiff.getY() == 0 ? 0 : diry * fy;
        return new Vec2(final_x, final_y);
    }

    // calculate spring damping force between 2 particles
    calculateDampingForce(se1, se2, r, kd) {
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
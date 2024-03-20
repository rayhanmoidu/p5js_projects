class PhysicsCalculator {
    constructor() {
    }

    computeMassMatrix(n, particles) {
        let massMatrix = new eigen.Matrix(3*n, 3*n);

        for (let i = 0; i < particles.length; i++) {
            let p_id = particles[i].getID();
            massMatrix.set(p_id*3, p_id*3, particles[i].getMass());
            massMatrix.set(p_id*3 + 1, p_id*3 + 1, particles[i].getMass());
            massMatrix.set(p_id*3 + 2, p_id*3 + 2, particles[i].getMass());
        }

        return massMatrix;
    }

    computeGradient(n, springs, particles, curGuessPosition, curPosition, prevPosition, massMatrix, timestep) {
        let gradient = new eigen.Matrix(3*n);

        for (let i = 0; i < 3*n; i++) {
            gradient.set(i, 0);
        }

        // apply spring forces
        for (let i = 0; i < springs.length; i++) {
            let endpoints = springs[i].getEndpoints();

            let ep1_id = endpoints[0].getID();
            let ep2_id = endpoints[1].getID();

            // print("curguess", curGuessPosition);

            let ep1_guessPos = new Vec3(curGuessPosition.get(ep1_id*3), curGuessPosition.get(ep1_id*3 + 1), curGuessPosition.get(ep1_id*3 + 2));
            let ep2_guessPos = new Vec3(curGuessPosition.get(ep2_id*3), curGuessPosition.get(ep2_id*3 + 1), curGuessPosition.get(ep2_id*3 + 2));

            let sf = this.computeSpringForce(ep1_guessPos, ep2_guessPos, springs[i].getR(), springs[i].getKs());
            // print(sf)
            gradient.set(ep1_id*3, gradient.get(ep1_id*3) + sf.getX());
            gradient.set(ep1_id*3 + 1, gradient.get(ep1_id*3 + 1) + sf.getY());
            gradient.set(ep1_id*3 + 2, gradient.get(ep1_id*3 + 2) + sf.getZ());

            gradient.set(ep2_id*3, gradient.get(ep2_id*3) - sf.getX());
            gradient.set(ep2_id*3 + 1, gradient.get(ep2_id*3 + 1) - sf.getY());
            gradient.set(ep2_id*3 + 2, gradient.get(ep2_id*3 + 2) - sf.getZ());
        }

        // apply external forces
        for (let i = 0; i < particles.length; i++) {
            let p_id = particles[i].getID();

            gradient.set(p_id*3, gradient.get(p_id*3) + externalF.getX());
            gradient.set(p_id*3 + 1, gradient.get(p_id*3 + 1) + externalF.getY());
            gradient.set(p_id*3 + 2, gradient.get(p_id*3 + 2) + externalF.getZ());
        }

        let y = curPosition.mul(2).matSub(prevPosition);
        let clause2 = massMatrix.matMul(curGuessPosition.matSub(y));
        let clause1 = gradient.mul(timestep*timestep);
        let finalgradient = clause2.matSub(clause1);

        // for (let i = 0; i < 300; i++) {
        //     print(i, massMatrix.get(i, i));
        // }
        return finalgradient;

        return gradient;
    }

    computeHessian(n, springs, massMatrix, timestep) {
        // let triplets = new eigen.TripletVector(springs.length * 4);

        // for (let i = 0; i < springs.length; i++) {
        //     let k_over_r = -springs[i].getKs() / springs[i].getR();

        //     let ep1_id = springs[i].getEndpoints()[0].getID();
        //     let ep2_id = springs[i].getEndpoints()[1].getID();

        //     for (let c = 0; c < 2; c++) {
        //         triplets.add(ep1_id*3 + c, ep2_id*3 + c, k_over_r);
        //         triplets.add(ep2_id*3 + c, ep1_id*3 + c, k_over_r);
        //         triplets.add(ep1_id*3 + c, ep1_id*3 + c, k_over_r);
        //         triplets.add(ep2_id*3 + c, ep2_id*3 + c, k_over_r);
        //     }
        // }

        // return new eigen.SparseMatrix.fromTriplets(3*n, 3*n, triplets);

        let hessian = new eigen.Matrix(3*n, 3*n);

        for (let i = 0; i < springs.length; i++) {
            let k_over_r = -springs[i].getKs() / springs[i].getR();

            let ep1_id = springs[i].getEndpoints()[0].getID();
            let ep2_id = springs[i].getEndpoints()[1].getID();

            for (let c = 0; c < 2; c++) {
                hessian.set(ep1_id*3 + c, ep2_id*3 + c, k_over_r);
                hessian.set(ep2_id*3 + c, ep1_id*3 + c, k_over_r);
                hessian.set(ep1_id*3 + c, ep1_id*3 + c, k_over_r);
                hessian.set(ep2_id*3 + c, ep2_id*3 + c, k_over_r);
            }
        }

        let finalHessian = massMatrix.matSub(hessian.mul(timestep*timestep))
        finalHessian = finalHessian.inverse();
        return finalHessian;
    }

    // calculate spring force between 2 particles
    computeSpringForce(pos1, pos2, r, ks) {

        // let posdiff = pos1.subtract(pos2);
        // let d = sqrt(posdiff.getX()*posdiff.getX() + posdiff.getY()*posdiff.getY());

        // let f_scalar = ks * (d/r - 1);
        // let theta = atan(abs(posdiff.getY()) / abs(posdiff.getX()));

        // let fx = f_scalar * cos(theta)
        // let fy = f_scalar * sin(theta);
        // let dirx = -posdiff.getX() / abs(posdiff.getX());
        // let diry = -posdiff.getY() / abs(posdiff.getY());

        // let final_x = posdiff.getX() == 0 ? 0 : dirx * fx;
        // let final_y = posdiff.getY() == 0 ? 0 : diry * fy;
        // return new Vec3(final_x, final_y, 0);

        let posdiff = pos1.subtract(pos2);

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
        // if (abs(finalz) > 50) {
        // print(finalx)
        // }

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
        let dirz = -posdiff.getZ() / abs(posdiff.getZ());
        let dir = new Vec3(dirx, diry, dirz);

        let dotres = vdiff.dot(dir);
        let finalforce = dir.scalarmult(kd*dotres);

        if (!isNaN(finalforce.getX()) && !isNaN(finalforce.getX()) && !isNaN(finalforce.getX())) {
            // print(finalforce)
            return finalforce;
        } else {
            return new Vec3(0, 0, 0);
        }
    }
}
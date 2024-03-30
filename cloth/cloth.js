let ks = 15000;
let kd = 0.005;

class Cloth {
    constructor() {
        this.springs = [];
        this.springEndpoints = [];
        this.fixedIds = [];
        this.endpoint_grid = [];

        this.createCloth();

        for (let i = 0; i < this.fixedIds.length; i++) {
            this.springEndpoints[this.fixedIds[i]].fix();
        }

        this.triangulation = new Triangulation(this.endpoint_grid);

        this.count = 0;
    }

    draw() {
        push();

        // let m = this.getTriangulation();
        // print(m.gid)
        // m.computeNormals();
        // print(m.faces)

        // for (let i = 0; i < this.springEndpoints.length; i++) {


        for (let i = 0; i < this.springEndpoints.length; i++) {

            // print(m.vertices)

            push();

            ambientLight(128,128,128);
            specularColor(200,200,200);
            pointLight(255,255,255, 300, 300, 100);
          
            noStroke();
            shininess(map(300, 0, width, 1, 30));
            specularMaterial(128);

            let curpos = this.springEndpoints[i].getPos();
            // print(curpos)
            translate(curpos.getX(), curpos.getY(), curpos.getZ());
            sphere(22);
            // print("hi", curpos)
            // model(m)
            // loadModel(m);
            // model(m)

        

            pop();
        }

        pop();
    }

    getTriangulation() {
        let triangles = this.triangulation.getTriangles();
        let springEndpoints = this.springEndpoints;

        let count = this.count + 1;
        this.count += 1;
        // print(springEndpoints[5].getPos());
        return new p5.Geometry(
            // detailX and detailY are not used in this example
            50, 50,
            
            // The callback must be an anonymous function, not an arrow function in
            // order for "this" to be bound correctly.
            function createCloth() {
                this.gid = `my-example-geometry ${count}`;
                // print(springEndpoints[5].getPos());
                for (let i = 0; i < springEndpoints.length; i++) {
                    let curPos = springEndpoints[i].getPos();
                    this.vertices.push(new p5.Vector(curPos.getX(), curPos.getY(), curPos.getZ()));
                }

                for (let i = 0; i < triangles.length; i++) {
                    this.faces.push(triangles[i].getVertices());
                } 

                this.computeNormals();

            }
        );
    }

    createSpringExample() {
        let ep1 = new SpringEndpoint(0, new Vec3(50, 400, 0), 500);
        let ep2 = new SpringEndpoint(1, new Vec3(550, 400, 0), 500);
        let s = new Spring(0, ep1, ep2, 400, ks, kd);

        this.springs = [s];
        this.springEndpoints = [ep1, ep2];
        this.fixedIds = [];
    }

    createCloth() {

        // create endpoint grid
        let id = 0;

        let width = 400;
        let density = 8;
        let dim = density - 1;
        let se_dist = width / density;
        
        for (let i = 0; i < density; i++) {
            let newrow = [];

            for (let j = 0; j < density; j++) {
                let x = i * se_dist - width/2;
                let y = j * se_dist - height/2;
                let z = 0;

                let new_endpoint = new SpringEndpoint(id++, new Vec3(x, y, z), 500);
                newrow.push(new_endpoint);
            }

            this.endpoint_grid.push(newrow);
        }

        // fix endpoints
        for (let i = 0; i < (dim+1)*(dim+1); i += dim+1) {
            this.fixedIds.push(i);
        }

        let newfixed = [this.fixedIds[this.fixedIds.length-1]];
        this.fixedIds = newfixed;

        // create springs

        let springs = [];
        let springID = 0;

        // horizontal
        for (let i = 0; i < this.endpoint_grid.length; i++) {
            let currow = this.endpoint_grid[i];
            for (let j = 0; j < currow.length - 1; j++) {
                let r = currow[j].getPos().subtract(currow[j+1].getPos()).length2();
                let s = new Spring(springID++, currow[j], currow[j+1], r, ks, kd);
                springs.push(s);
            }
        }

        // vertical
        for (let i = 0; i < this.endpoint_grid.length - 1; i++) {
            for (let j = 0; j < this.endpoint_grid[i].length; j++) {
                let r = this.endpoint_grid[i][j].getPos().subtract(this.endpoint_grid[i+1][j].getPos()).length2();
                let s = new Spring(springID++, this.endpoint_grid[i][j], this.endpoint_grid[i+1][j], r, ks, kd);
                springs.push(s);
            }
        }

        // forward diagnoals
        for (let i = 0; i < this.endpoint_grid.length - 1; i++) {
            for (let j = 0; j < this.endpoint_grid[i].length - 1; j++) {
                let r = this.endpoint_grid[i][j].getPos().subtract(this.endpoint_grid[i+1][j+1].getPos()).length2();
                let s = new Spring(springID++, this.endpoint_grid[i][j], this.endpoint_grid[i+1][j+1], r, ks, kd);
                springs.push(s);
            }
        }

        // backward diagnoals
        for (let i = 0; i < this.endpoint_grid.length - 1; i++) {
            for (let j = 1; j < this.endpoint_grid[i].length; j++) {
                let r = this.endpoint_grid[i][j].getPos().subtract(this.endpoint_grid[i+1][j-1].getPos()).length2();
                let s = new Spring(springID++, this.endpoint_grid[i][j], this.endpoint_grid[i+1][j-1], r, ks, kd);
                springs.push(s);
            }
        }

        for (let i = 0; i < this.endpoint_grid.length; i++) {
            for (let j = 0; j < this.endpoint_grid[i].length; j++) {
                this.springEndpoints.push(this.endpoint_grid[i][j]);
            }
        }

        this.springs = springs;

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
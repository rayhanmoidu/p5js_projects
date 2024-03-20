class Triangulation {
    
    constructor(endpoint_grid) {
        this.triangles = [];
        this.edges = new Set();
        this.edges_to_triangles = new Map();
        this.vertices_to_triangles = new Map();
        this.vertices_to_neighbourVertices = new Map();
        this.vertices_to_normals = new Map();

        this.createTriangulation(endpoint_grid);
    }

    getTriangles() {
        return this.triangles;
    }

    hashEdge(a, b) {
        if (a==b) {
            assert(false);
        }
        if (b < a) {
            let temp = b;
            b = a;
            a = temp;
        }
        return (a + b) * (a + b + 1) / 2 + a;
    }

    // will the maps work by reference? idk
    addToMap_V2NV(v1, v2) {
        if (this.vertices_to_neighbourVertices.has(v1)) {
            let curList = this.vertices_to_neighbourVertices.get(v1);
            curList.push(v2);
            this.vertices_to_neighbourVertices.set(v1, curList);
        } else {
            this.vertices_to_neighbourVertices.set(v1, [v2]);
        }

        if (this.vertices_to_neighbourVertices.has(v2)) {
            let curList = this.vertices_to_neighbourVertices.get(v2);
            curList.push(v1);
            this.vertices_to_neighbourVertices.set(v2, curList);
        } else {
            this.vertices_to_neighbourVertices.set(v2, [v1]);
        }
    }

    addToMap_V2T(v, t) {
        if (this.vertices_to_triangles.has(v)) {
            let curList = this.vertices_to_triangles.get(v);
            curList.push(t);
            this.vertices_to_triangles.set(v, curList);
        } else {
            this.vertices_to_triangles.set(v, [t]);
        }
    }

    addToMap_E2T(e, t) {
        if (this.edges_to_triangles.has(e)) {
            let curList = this.edges_to_triangles.get(e);
            curList.push(t);
            this.edges_to_triangles.set(e, curList);
        } else {
            this.edges_to_triangles.set(e, [t]);
        }
    }

    createTriangulation(endpoint_grid) {
        for (let col = 0; col < endpoint_grid.length - 1; col++) {
            for (let row = 0; row < endpoint_grid[col].length - 1; row++) {
                let t1_e1 = this.hashEdge(endpoint_grid[col][row].getID(), endpoint_grid[col][row+1].getID());
                let t1_e2 = this.hashEdge(endpoint_grid[col][row].getID(), endpoint_grid[col+1][row].getID());
                let shared_edge = this.hashEdge(endpoint_grid[col][row+1].getID(), endpoint_grid[col+1][row].getID());
                let t2_e1 = this.hashEdge(endpoint_grid[col][row+1].getID(), endpoint_grid[col+1][row+1].getID());
                let t2_e2 = this.hashEdge(endpoint_grid[col+1][row].getID(), endpoint_grid[col+1][row+1].getID());

                this.addToMap_V2NV(endpoint_grid[col][row].getID(), endpoint_grid[col][row+1].getID());
                this.addToMap_V2NV(endpoint_grid[col][row].getID(), endpoint_grid[col+1][row].getID());
                this.addToMap_V2NV(endpoint_grid[col][row+1].getID(), endpoint_grid[col+1][row].getID());
                this.addToMap_V2NV(endpoint_grid[col][row+1].getID(), endpoint_grid[col+1][row+1].getID());
                this.addToMap_V2NV(endpoint_grid[col+1][row].getID(), endpoint_grid[col+1][row+1].getID());

                this.edges.add(t1_e1)
                this.edges.add(t1_e2)
                this.edges.add(shared_edge)
                this.edges.add(t2_e1)
                this.edges.add(t2_e2)

                let t1 = new ClothTriangle(endpoint_grid[col][row].getID(), endpoint_grid[col+1][row].getID(), endpoint_grid[col][row+1].getID());
                let t2 = new ClothTriangle(endpoint_grid[col][row+1].getID(), endpoint_grid[col+1][row].getID(), endpoint_grid[col+1][row+1].getID());

                this.addToMap_V2T(endpoint_grid[col][row].getID(), t1);
                this.addToMap_V2T(endpoint_grid[col+1][row].getID(), t1);
                this.addToMap_V2T(endpoint_grid[col][row+1].getID(), t1);
                this.addToMap_V2T(endpoint_grid[col+1][row].getID(), t2);
                this.addToMap_V2T(endpoint_grid[col][row+1].getID(), t2);
                this.addToMap_V2T(endpoint_grid[col+1][row+1].getID(), t2);

                this.addToMap_E2T(t1_e1, t1);
                this.addToMap_E2T(t1_e2, t1);
                this.addToMap_E2T(shared_edge, t1);
                this.addToMap_E2T(shared_edge, t2);
                this.addToMap_E2T(t2_e1, t2);
                this.addToMap_E2T(t2_e2, t2);

                this.triangles.push(t1);
                this.triangles.push(t2);
            }
        }

        return this.triangles;
    }

}
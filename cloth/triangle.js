class ClothTriangle {
    constructor(v1_id, v2_id, v3_id ) {
        this.v1_id = v1_id;
        this.v2_id = v2_id;
        this.v3_id = v3_id;
        this.numEdgesUnsplit = 3;
    }

    getVertices() {
        return [this.v1_id, this.v2_id, this.v3_id];
    }
}
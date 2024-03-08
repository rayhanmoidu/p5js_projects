class Shape {
    constructor(preTranslate, xOffsets, yOffsets, rOffsets) {
        this.xOffsets = xOffsets;
        this.yOffsets = yOffsets;
        this.rOffsets = rOffsets;
        this.preTranslate = preTranslate;
    }

    // returns 3-vector shape offset for visual component i
    getOffset(i) {
        return new Vec3(this.xOffsets[i], this.yOffsets[i], this.rOffsets[i]);
    }

    // returns if the visual component should be translated before scaling
    shouldPreTranslate() {
        return this.preTranslate;
    }
}
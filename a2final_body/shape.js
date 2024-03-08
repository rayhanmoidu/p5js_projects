class Shape {
    constructor(preTranslate, xOffsets, yOffsets, rOffsets) {
        this.xOffsets = xOffsets;
        this.yOffsets = yOffsets;
        this.rOffsets = rOffsets;
        this.preTranslate = preTranslate;
    }

    getOffset(i) {
        return new Vec3(this.xOffsets[i], this.yOffsets[i], this.rOffsets[i]);
    }

    shouldPreTranslate() {
        return this.preTranslate;
    }
}
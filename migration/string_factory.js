class StringFactory {
    constructor(hills) {
        this.hills = hills;
    }

    update(personaStrings) {
    }

    createString(hillId) {
        let hill = this.hills[hillId];

        let maxX = hill.getBaseWidth();
        let startX = random(0, maxX);
        while (hill.testStartPos_x(startX)) {
            startX = random(0, maxX);
        }

        let startpos = new Vec2(startX, height + 50);
        let destpos = hill.getEndPos();

        return new PersonaString(hill.getScale(), startpos, destpos);
    }
}
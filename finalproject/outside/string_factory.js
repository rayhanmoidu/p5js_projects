class StringFactory {
    constructor(hills) {
        this.hills = hills;
    }

    update(personaStrings) {
    }

    createString(hillId) {
        let hill = this.hills[hillId];

        // let maxX = hill.getBaseWidth();
        // let startX = random(0, maxX);
        // while (hill.testStartPos_x(startX)) {
        //     startX = random(0, maxX);
        // }

        let startpos = hill.getStartPos();
        let destpos = hill.getEndPos(startpos);

        return new PersonaString(hillId, hill.getScale(), startpos, destpos);
    }
}
class StringFactory {
    constructor(hills) {
        this.hills = hills;
    }

    update(personaStrings) {
    }

    createString(hillId, mult) {
        let hill = this.hills[hillId];

        // let maxX = hill.getBaseWidth();
        // let startX = random(0, maxX);
        // while (hill.testStartPos_x(startX)) {
        //     startX = random(0, maxX);
        // }

        let startpos = hill.getStartPos();
        let destpos = hill.getEndPos(startpos);

        let fact = mult - 1;


        let adder = startpos.subtract(destpos).scalarmult(fact);

        if (hillId==2) {
            print(destpos, startpos)
        }

        // print(startpos, destpos, hillId)

        return new PersonaString(hillId, hill, hill.getScale(), startpos.add(adder), destpos);
    }
}
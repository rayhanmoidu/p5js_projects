class StringFactory {
    constructor(hills) {
        this.hills = hills;
    }

    createString(hillId, mult) {
        let hill = this.hills[hillId];

        // get start and end pos
        let startpos = hill.getStartPos();
        let endpos = hill.getEndPos(startpos);

        // for strings that begin further away, computer adder
        let fact = mult - 1;
        let adder = startpos.subtract(endpos).scalarmult(fact);

        return new PersonaString(hillId, hill.getScale(), startpos.add(adder), endpos);
    }
}
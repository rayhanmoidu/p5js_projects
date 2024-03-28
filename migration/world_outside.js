class World_Outside {
    constructor(w, h) {

        this.w = w;
        this.h = h;

        this.hills = [];
        this.createHills();

        this.castle = new Castle();

        this.stringFactory = new StringFactory(this.hills);
        this.personaStrings = [];

        // this.personastring = new PersonaString(1, new Vec2(300, 300), new Vec2(500, 500));
    }

    update() {
        this.stringFactory.update(this.personaStrings);
        for (let i = 0; i < this.personaStrings.length; i++) {
            this.personaStrings[i].update();
        }
        // this.personastring.update();
    }

    draw() {
        this.createHills();
        this.hills[2].draw();
        this.hills[1].draw();
        this.hills[0].draw();

        for (let i = 0; i < this.personaStrings.length; i++) {
            this.personaStrings[i].draw();
        }

        // this.personastring.draw();
    }

    createHills() {
        let vertices;
        let v1, v2, v3, v4, v5, v6, v7, v8, v9, v10;

        // hill 1
        v1 = new Vec2(-50, this.h - this.h * 0.1);
        v2 = new Vec2(-50, this.h - this.h * 0.1);
        v3 = new Vec2(this.w * 0.075, this.h - this.h * 0.15);
        v4 = new Vec2(this.w * 0.35, this.h - this.h * 0.4);
        v5 = new Vec2(this.w * 0.65, this.h - this.h * 0.05);
        v6 = new Vec2(this.w * 0.9, height + 50);
        v7 = new Vec2(this.w * 0.9, height + 50);
        vertices = [v1, v2, v3, v4, v5, v6, v7];
        let hill1 = new Hill(0, vertices, this.w * 0.7, 1);

        // hill 2
        v1 = new Vec2(-50, this.h - this.h * 0.3);
        v2 = new Vec2(-50, this.h - this.h * 0.3);
        v3 = new Vec2(this.w * 0.2, this.h - this.h * 0.25);
        v4 = new Vec2(this.w * 0.65, this.h - this.h * 0.6);
        v5 = new Vec2(this.w * 0.9, this.h - this.h * 0.35);
        v6 = new Vec2(width + 50, this.h - this.h * 0.375);
        v7 = new Vec2(width + 50, this.h - this.h * 0.375);
        vertices = [v1, v2, v3, v4, v5, v6, v7];
        let hill2 = new Hill(1, vertices, this.w, 0.6);

        // hill 3
        v1 = new Vec2(-50, this.h - this.h * 0.5);
        v2 = new Vec2(-50, this.h - this.h * 0.5);
        v3 = new Vec2(this.w * 0.05, this.h - this.h * 0.45);
        v4 = new Vec2(this.w * 0.35, this.h - this.h * 0.75);
        v5 = new Vec2(this.w * 0.7, this.h - this.h * 0.5);
        v6 = new Vec2(width + 50, this.h - this.h * 0.6);
        v7 = new Vec2(width + 50, this.h - this.h * 0.6);
        vertices = [v1, v2, v3, v4, v5, v6, v7];
        let hill3 = new Hill(2, vertices, this.w, 0.3);

        this.hills = [hill1, hill2, hill3];
    }
}
class World_Outside {
    constructor(w, h) {

        this.w = w;
        this.h = h;

        this.graphics_object = createGraphics(this.w, this.h);

        this.numHills = 3;
        this.hills = [];
        this.createHills();

        this.castle = new Castle(this.w * 0.275, this.h - this.h * 0.875, s.castleW, s.castleH);

        this.stringFactory = new StringFactory(this.hills);
        this.personaStrings = []
        for (let i = 0; i < this.numHills; i++) {
            this.personaStrings.push([this.stringFactory.createString(i)]);
        }
    }

    update() {
        // print(s.castleW)
        this.castle = new Castle(this.w * 0.275, this.h - this.h * 0.875, s.castleW, s.castleH);
        this.stringFactory.update(this.personaStrings);
        // let toRemove = [];
        for (let i = 0; i < this.numHills; i++) {
            for (let j = 0; j < this.personaStrings[i].length; j++) {
                if (this.personaStrings[i][j].update(this.personaStrings, i, j)) {
                    // toRemove.push(new Vec2(i, j));
                    // print("adding new ", i)
                    this.personaStrings[i].splice(j, 1);
                    this.personaStrings[i].push(this.stringFactory.createString(i));
                }
            }
        }

        for (let i = 0; i < this.numHills; i++) {
            for (let j = 0; j < this.personaStrings[i].length; j++) {
                if (this.personaStrings[i][j].shouldAddNew()) {
                    // toRemove.push(new Vec2(i, j));
                    // this.personaStrings[i].splice(j, 1);
                    this.personaStrings[i].push(this.stringFactory.createString(i));
                }
            }
        }

        // print(this.personaStrings)

        // for (let i = 0; i < toRemove.length; i++) {
        //     this.personaStrings[toRemove[i].getX()].splice(toRemove[i].getY(), 1)
        //     this.personaStrings[toRemove[i].getX()].push(this.stringFactory.createString(i));
        // }
    }

    addString(i) {
        this.personaStrings[i].push(this.stringFactory.createString(i));
    }

    getGraphicsObject() {
        // this.createHills();

        this.graphics_object.push();

        this.graphics_object.background(16, 12, 47);
        // translate(-width/2, -height/2)

        for (let i = this.numHills - 1; i >= 0; i--) {
            this.hills[i].draw(this.graphics_object);
            if (i == this.numHills - 1) {
                this.castle.draw(this.graphics_object);
            }
            this.drawPersonas(i);
        }


        this.graphics_object.pop();

        return this.graphics_object;

        // this.hills[2].draw();
        // this.drawPersonas(2);

        // this.hills[1].draw();
        // this.drawPersonas(1);

        // this.hills[0].draw();
        // this.drawPersonas(0);
    }

    drawPersonas(hillId) {
        for (let i = 0; i < this.personaStrings[hillId].length; i++) {
            this.personaStrings[hillId][i].draw(this.graphics_object);
        }
    }

    createHills() {
        let vertices;
        let v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11;

        // hill 1
        v1 = new Vec2(-50, this.h - this.h * 0.1);
        v2 = new Vec2(-50, this.h - this.h * 0.1);
        v3 = new Vec2(this.w * 0.075, this.h - this.h * 0.15);
        v4 = new Vec2(this.w * 0.35, this.h - this.h * 0.4);
        v5 = new Vec2(this.w * 0.65, this.h - this.h * 0.05);
        v6 = new Vec2(this.w * 0.9, this.h + 50);
        v7 = new Vec2(this.w * 0.9, this.h + 50);
        v8 = new Vec2(-50, this.h + 50)
        v9 = new Vec2(-50, this.h + 50)
        vertices = [v1, v2, v3, v4, v5, v6, v7, v8, v9];

        let startpos_piecewise = [new Vec2(-this.w*0.1, this.h + 50), new Vec2(0, this.h + 100), new Vec2(this.w*0.65, this.h + 100)]
        let hill1 = new Hill(0, vertices, 0.5, this.w * 0.2, this.w * 0.5, [-this.w*0.1, this.w*0.65], startpos_piecewise);

        // hill 2
        v1 = new Vec2(-50, this.h - this.h * 0.3);
        v2 = new Vec2(-50, this.h - this.h * 0.3);
        v3 = new Vec2(this.w * 0.2, this.h - this.h * 0.25);
        v4 = new Vec2(this.w * 0.65, this.h - this.h * 0.6);
        v5 = new Vec2(this.w * 0.9, this.h - this.h * 0.35);
        v6 = new Vec2(this.w + 50, this.h - this.h * 0.375);
        v7 = new Vec2(this.w + 50, this.h - this.h * 0.375);
        v8 = new Vec2(this.w + 50, this.h + 50);
        v9 = new Vec2(this.w + 50, this.h + 50);
        v10 = new Vec2(-50, this.h + 50);
        v11 = new Vec2(-50, this.h + 50);
        vertices = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11];

        startpos_piecewise = [new Vec2(this.w*0.35, this.h - this.h*0.3), new Vec2(this.w*0.65, this.h + 50), new Vec2(this.w, this.h + 50), new Vec2(this.w*1.1, this.h - this.h*0.3)]
        let hill2 = new Hill(1, vertices, 0.25, this.w * 0.45, this.w * 0.9, [this.w*0.4, this.w*1.1], startpos_piecewise);

        // hill 3
        v1 = new Vec2(-50, this.h - this.h * 0.5);
        v2 = new Vec2(-50, this.h - this.h * 0.5);
        v3 = new Vec2(this.w * 0.05, this.h - this.h * 0.45);
        v4 = new Vec2(this.w * 0.35, this.h - this.h * 0.75);
        v5 = new Vec2(this.w * 0.7, this.h - this.h * 0.5);
        v6 = new Vec2(this.w + 50, this.h - this.h * 0.6);
        v7 = new Vec2(this.w + 50, this.h - this.h * 0.6);
        v8 = new Vec2(this.w + 50, this.h + 50);
        v9 = new Vec2(this.w + 50, this.h + 50);
        v10 = new Vec2(-50, this.h + 50);
        v11 = new Vec2(-50, this.h + 50);
        vertices = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11];

        startpos_piecewise = [new Vec2(-this.w*0.1, this.h - this.h * 0.3), new Vec2(0, this.h - this.h*0.2), new Vec2(this.w*0.6, this.h - this.h*0.5)]
        let hill3 = new Hill(2, vertices, 0.125, this.w * 0.1, this.w * 0.6, [-this.w*0.1, this.w*0.55], startpos_piecewise);

        this.hills = [hill1, hill2, hill3];
    }
}
class World_Outside {
    constructor(w, h) {

        this.w = w;
        this.h = h;

        this.createHills();
        this.castle = new Castle();
    }

    createHills() {

        let v1, v2, v3, v4, v5, v6, v7, v8, v9, v10;

        // hill 1
        v1 = new Vec2(-50, this.h - this.h * 0.1);
        v2 = new Vec2(-50, this.h - this.h * 0.1);
        v3 = new Vec2(this.w * 0.075, this.h - this.h * 0.15);
        v4 = new Vec2(this.w * 0.35, this.h - this.h * 0.4);
        v5 = new Vec2(this.w * 0.65, this.h - this.h * 0.05);
        v6 = new Vec2(this.w * 0.9, height + 50);
        v7 = new Vec2(this.w * 0.9, height + 50);
        let hill1 = new Hill([v1, v2, v3, v4, v5, v6, v7]);

        // hill 2
        v1 = new Vec2(-50, this.h - this.h * 0.3);
        v2 = new Vec2(-50, this.h - this.h * 0.3);
        v3 = new Vec2(this.w * 0.2, this.h - this.h * 0.25);
        v4 = new Vec2(this.w * 0.65, this.h - this.h * 0.6);
        v5 = new Vec2(this.w * 0.9, this.h - this.h * 0.35);
        v6 = new Vec2(width + 50, this.h - this.h * 0.375);
        v7 = new Vec2(width + 50, this.h - this.h * 0.375);
        let hill2 = new Hill([v1, v2, v3, v4, v5, v6, v7]);

         // hill 3
         v1 = new Vec2(-50, this.h - this.h * 0.5);
         v2 = new Vec2(-50, this.h - this.h * 0.5);
         v3 = new Vec2(this.w * 0.05, this.h - this.h * 0.45);
         v4 = new Vec2(this.w * 0.35, this.h - this.h * 0.75);
         v5 = new Vec2(this.w * 0.7, this.h - this.h * 0.5);
         v6 = new Vec2(width + 50, this.h - this.h * 0.6);
         v7 = new Vec2(width + 50, this.h - this.h * 0.6);
         let hill3 = new Hill([v1, v2, v3, v4, v5, v6, v7]);


        this.hills = [hill1, hill2, hill3];

        // let hill1 = new Hill();
        // let hill2 = new Hill();
        // let hill3 = new Hill();
        // this.hills = [hill1, hill2, hill3];
    }

    update() {

    }

    draw() {
        this.createHills();
        this.hills[2].draw();
        this.hills[1].draw();
        this.hills[0].draw();
        // this.castle.draw();

        // // hill 2 (middle)

        

        // // hill 3 (closest)

        // this.hills[2].draw();

    }
}
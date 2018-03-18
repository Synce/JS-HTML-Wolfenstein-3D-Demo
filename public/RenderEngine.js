import WallsSpriteSheet from "./WallsSpriteSheet.js";
import SpriteSheet from "./SpriteSheet.js";

export default class RenderEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')
        this.strips = [];
        this.objects = [];


    }

    loadTextures(walls, objects) {
        let that = this;
        that.wallsSpriteSheet = new WallsSpriteSheet(walls, 64, 64)
        that.objectsSpriteSheet = new SpriteSheet(objects)
        that.objectsSpriteSheet.defineAll(64.8, 64.8)

    }

    drawStrip(textureID, textureX, x, y, width, height, isDark) {

        this.ctx.drawImage(this.wallsSpriteSheet.getWall(textureID, isDark), textureX, 0, width, 64, x, y, width, height);
    }

    drawObject(id, x, y, size) {
        this.ctx.drawImage(this.objectsSpriteSheet.getSprite(id), 0, 0, 64, 64, x, y, size, size);
    }

    addStripToRender(strip) {
        this.strips.push(strip);
    }

    addObjectToDraw(object) {
        this.objects.push(object);
    }

    render() {
        function compareDist(a, b) {
            return b.dist - a.dist
        }

        this.strips.sort(compareDist)
        this.objects.sort(compareDist)
        let Si = 0;
        let Oi = 0;


        while (Oi < this.objects.length || Si < this.strips.length) {

            if (Oi >= this.objects.length || (Si < this.strips.length && this.strips[Si].dist > this.objects[Oi].dist)) {
                let strip = this.strips[Si];
                this.drawStrip(strip.textureID, strip.textureX, strip.x, strip.y, strip.stripWidth, strip.height, strip.isDark);

                Si++
            }
            else {
                let obj = this.objects[Oi];
                this.drawObject(obj.id, obj.drawX, obj.drawY, obj.size);
                Oi++
            }
        }


        this.strips = [];
        this.objects = [];
    }

}
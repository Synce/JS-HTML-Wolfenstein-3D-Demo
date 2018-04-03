import WallsSpriteSheet from "./WallsSpriteSheet.js";
import SpriteSheet from "./SpriteSheet.js";

export default class RenderEngine {
    constructor(canvas, handler) {
        this.canvas = canvas;
        this.entityHandler = handler;
        this.ctx = canvas.getContext('2d')
        this.strips = [];
        this.objects = [];
        this.entities = [];


    }

    loadTextures(walls, objects, animationBank) {

        this.wallsSpriteSheet = new WallsSpriteSheet(walls, 64, 64)
        this.objectsSpriteSheet = new SpriteSheet(objects)
        this.objectsSpriteSheet.defineAll(64.8, 64.8)
        this.animationBank = animationBank;

    }

    drawStrip(textureID, textureX, x, y, width, height, isDark, translate) {

        this.ctx.drawImage(this.wallsSpriteSheet.getWall(textureID, isDark), textureX - translate, 0, width, 64, x, y, width, height);
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

    addEntityToDraw(entity) {
        this.entities.push(entity)
    }

    drawEntity(id, x, y, size, angle) {
        let d = this.entityHandler.getEntityToDraw(id, angle)
        this.ctx.drawImage(this.animationBank.getFrame(d.type, d.animation, d.frame), 0, 0, 64, 64, x, y, size, size);
    }

    render() {
        function compareDist(a, b) {
            return b.dist - a.dist
        }

        this.strips.sort(compareDist)
        this.objects.sort(compareDist)
        this.entities.sort(compareDist)
        let Si = 0;
        let Oi = 0;
        let Ei = 0;


        while (Oi < this.objects.length || Si < this.strips.length || Ei < this.entities.length) {

            if (Oi < this.objects.length && (Si >= this.strips.length || this.objects[Oi].dist > this.strips[Si].dist) && (Ei >= this.entities.length || this.objects[Oi].dist > this.entities[Ei].dist)) {

                let obj = this.objects[Oi];
                this.drawObject(obj.id, obj.drawX, obj.drawY, obj.size);
                Oi++
            }
            else if (Ei < this.entities.length && (Si >= this.strips.length || this.entities[Ei].dist > this.strips[Si].dist)) {
                let ent = this.entities[Ei]
                this.drawEntity(ent.id, ent.drawX, ent.drawY, ent.size, ent.angle)
                Ei++;


            }
            else {
                let strip = this.strips[Si];
                this.drawStrip(strip.textureID, strip.textureX, strip.x, strip.y, strip.stripWidth, strip.height, strip.isDark, strip.translate);

                Si++

            }
        }


        this.strips = [];
        this.objects = [];
        this.entities = [];
    }

}
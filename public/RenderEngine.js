import WallsSpriteSheet from "./WallsSpriteSheet.js";
import SpriteSheet from "./SpriteSheet.js";
import Heap from "./Heap.js";

export default class RenderEngine {
    constructor(canvas, handler) {
        this.canvas = canvas;
        this.entityHandler = handler;
        this.ctx = canvas.getContext('2d')
        this.strips = new Heap(function (x) {
            return -x.dist;
        });
        this.objects = new Heap(function (x) {
            return -x.dist;
        });
        this.entities = new Heap(function (x) {
            return -x.dist;
        });

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
        /*
           function compareDist(a, b) {
               return b.dist - a.dist
           }

           this.strips.sort(compareDist)
           this.objects.sort(compareDist)
           this.entities.sort(compareDist)
           let Si = 0;
           let Oi = 0;
           let Ei = 0;
   */


        while (this.objects.length() > 0 || this.strips.length() > 0 || this.entities.length() > 0) {

            if (this.objects.length() > 0 && (this.strips.length() == 0 || this.objects.getScore() < this.strips.getScore()) && (this.entities.length() == 0 || this.objects.getScore() < this.entities.getScore())) {

                let obj = this.objects.pop();

                this.drawObject(obj.id, obj.drawX, obj.drawY, obj.size);

            }
            else if (this.entities.length() > 0 && (this.strips.length() == 0 || this.entities.getScore() < this.strips.getScore())) {
                let ent = this.entities.pop();

                this.drawEntity(ent.id, ent.drawX, ent.drawY, ent.size, ent.angle)


            }
            else {
                let strip = this.strips.pop();

                this.drawStrip(strip.textureID, strip.textureX, strip.x, strip.y, strip.stripWidth, strip.height, strip.isDark, strip.translate);


            }

        }


        this.strips.content = [];
        this.objects.content = [];
        this.entities.content = [];
    }

}
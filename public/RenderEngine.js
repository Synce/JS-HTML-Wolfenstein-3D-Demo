import WallsSpriteSheet from "./WallsSpriteSheet.js";
import SpriteSheet from "./SpriteSheet.js";
import Heap from "./Heap.js";
import TimeHelper from "./TimeHelper.js";

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

    setHUD(HUD) {
        this.HUD = HUD;
    }

    loadTextures(walls, objects, animationBank) {

        this.wallsSpriteSheet = new WallsSpriteSheet(walls, 64, 64)
        this.objectsSpriteSheet = new SpriteSheet(objects)

        this.objectsSpriteSheet.defineAll(64.9, 64.9)
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

        try {
            this.ctx.drawImage(this.animationBank.getFrame(d.type, d.animation, d.frame), 0, 0, 64, 64, x, y, size, size);
        }
        catch {
            console.log(d)
        }
    }

    drawHUD(delta) {
        let a = this.HUD.getHud();
        if (a.lose) {
            this.ctx.fillStyle = "#e20606";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = "60px Arial";
            if (!this.dead) {
                this.dead = new TimeHelper(2, 1);
            }

            this.ctx.fillStyle = "white";
            this.ctx.fillText("YOU ARE DEAD", this.canvas.width / 2 - 210, this.canvas.height / 2 - 20);
        } else {
            if (a.flash) {
                this.ctx.fillStyle = "rgba(247, 203, 9,0.3)";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            }

            this.ctx.drawImage(a.weapon, 275, 155, 350, 350);
            this.ctx.drawImage(a.bg, 0, 500, 900, 103);
            this.ctx.drawImage(a.face, 374, 500, 99, 99);
            if (a.hp.length == 3) {
                this.ctx.drawImage(a.hp[0], 475, 533, 25, 55);
                this.ctx.drawImage(a.hp[1], 495, 533, 25, 55);
                this.ctx.drawImage(a.hp[2], 520, 533, 25, 55);
            } else if (a.hp.length == 2) {
                this.ctx.drawImage(a.hp[0], 490, 533, 25, 55);
                this.ctx.drawImage(a.hp[1], 515, 533, 25, 55);
            }
            else {
                this.ctx.drawImage(a.hp[0], 515, 533, 25, 55);
            }
            for (let i = 0; i < a.sc.length; i++) {
                this.ctx.drawImage(a.sc[i], 240 - i * 25, 533, 25, 55);
            }
            for (let i = 0; i < a.ammo.length; i++) {
                this.ctx.drawImage(a.ammo[i], 660 - i * 25, 533, 25, 55);
            }
            this.ctx.drawImage(a.lives[0], 320, 533, 25, 55);
            this.ctx.drawImage(a.lvl[0], 50, 533, 25, 55);
            this.ctx.drawImage(a.hw, 720, 510, 190, 75);
        }
    }

    render(delta) {


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
        this.drawHUD(delta)
    }

}
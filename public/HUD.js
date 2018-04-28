import Animation from "./Animation.js";
import SpriteSheet from "./SpriteSheet.js";
import TimeHelper from "./TimeHelper.js";

export default class HUD {
    constructor(HUDImg, faceIMg, weaponsIMG, settings, player) {
        this.faceAnimations = new Animation(faceIMg, settings.face, 25, 33);
        this.weaponsAnimations = new Animation(weaponsIMG, settings.weapons, 65, 65);
        this.player = player;
        this.bg = new SpriteSheet(HUDImg)
        this.bg.define(10, 5, 300, 33)
        this.frameUpdater = new TimeHelper(3 * 0.7, 3);
        this.numbers = new SpriteSheet(HUDImg)
        for (let i = 0; i < 10; i++) {
            this.numbers.define(228 + i * 9, 41, 9, 16)
        }


        this.faceFrame = 0;


    }

    update(time) {
        this.faceFrame = Math.floor(this.frameUpdater.update(time));
        if (this.faceFrame == 3) {
            this.frameUpdater.reset();
            this.faceFrame = 0;
        }
    }

    getHud() {
        let hp = [];
        let sc = [];
        let lvl = [];
        let lives = [];
        let amm = [];
        let flash;
        if (this.player.hp == 100) {
            hp.push(this.numbers.getSprite(1))
            hp.push(this.numbers.getSprite(0))
            hp.push(this.numbers.getSprite(0))
        } else {
            if (Math.floor(this.player.hp / 10) > 0) {
                hp.push(this.numbers.getSprite(Math.floor(this.player.hp / 10)))
            }
            hp.push(this.numbers.getSprite(Math.floor(this.player.hp % 10)))

        }
        let face = Math.floor((100 - this.player.hp) / 14.3)
        let score = this.player.score.toString()
        for (let i = score.length; i > 0; i--) {

            sc.push(this.numbers.getSprite(score[i - 1]))
        }
        let ammo = this.player.ammo.toString()
        for (let i = ammo.length; i > 0; i--) {

            amm.push(this.numbers.getSprite(ammo[i - 1]))
        }
        lvl.push(this.numbers.getSprite(this.player.lvl))
        lives.push(this.numbers.getSprite(this.player.lives))
        let weapon = 'w' + this.player.weapon;
        if (this.player.pickUp != null) {
            flash = true;
        }
        return {
            face: this.faceAnimations.getAnimation('hp' + face, this.faceFrame),
            bg: this.bg.getSprite(0),
            hp: hp,
            sc: sc,
            lvl: lvl,
            lives: lives,
            ammo: amm,
            weapon: this.weaponsAnimations.getAnimation(weapon, this.player.weaponFrame),
            flash: flash
        }
    }
}
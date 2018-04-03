import Animation from "./Animation.js";

export default class EntityAnimationsBank {
    constructor(config) {
        this.config = config;
        this.bank = {};
    }

    getTextureNamesToLoad() {
        return Object.keys(this.config)
    }

    newAnimation(type, img) {
        this.bank[type] = new Animation(img, this.config[type].animations, 64.8, 64.8)
    }

    getFrame(type, animation, frame) {
        let a = this.bank[type].getAnimation(animation, frame)
        return a;
    }

}
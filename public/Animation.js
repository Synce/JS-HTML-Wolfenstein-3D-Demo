import SpriteSheet from "./SpriteSheet.js";

export default class Animation extends SpriteSheet {
    constructor(image, config, width, height) {
        super(image)
        this.config = config;
        this.animations = {};
        this.width = width;
        this.height = height;
        this.defineAnimations();
    }

    defineAnimations() {
        if (this.config.type === 'equal')
            for (let animation in this.config) {
                if (animation !== 'type') {
                    for (let x = this.config[animation].fX; x <= this.config[animation].tX; x++)
                        for (let y = this.config[animation].fY; y <= this.config[animation].tY; y++)
                            this.define(x * this.width, y * this.height, this.width, this.height);

                    this.animations[animation] = this.textures;
                    this.textures = [];
                }
            }
    }

    getAnimation(animation, frame) {

        return this.animations[animation][frame];
    }
}
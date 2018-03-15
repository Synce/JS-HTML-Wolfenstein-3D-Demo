import SpriteSheet from "./SpriteSheet.js";

export default class WallsSpriteSheet extends SpriteSheet {
    constructor(image, width, height) {
        super(image)
        this.width = width;
        this.height = height;
        super.defineAll(width, height);
        let arr = [];
        for (let i = 0; i < this.textures.length / 2; i += 2) {
            arr[i / 2] = [this.textures[i], this.textures[i + 1]]
        }
        this.textures = arr;
        console.log(this.textures)

    }


    getWall(id, isDark) {
        if (isDark)
            return this.textures[id][1]
        else
            return this.textures[id][0]
    }
}

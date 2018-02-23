import SpriteSheet from "./SpriteSheet";

class WallsSpriteSheet extends SpriteSheet {
    constructor(image, width, height) {
        super(image)
        this.width = width;
        this.height = height;
        this.defineAll(width, height);
        let arr = [];
        for (let i = 0; i < this.textures.length / 2; i += 2) {
            arr[i] = [this.textures[i], this.textures[i + 1]]
        }
        this.textures = arr;


    }


    getWall(id,isDark){
        if(isDark)
            return this.textures[id][1]
        else
            return this.textures[id][0]
    }
}

import WallsSpriteSheet from "./WallsSpriteSheet.js";

export default class RenderEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')
        this.wallsSpriteSheet = null;


    }

    loadTextures(image) {
        let that = this;
        that.wallsSpriteSheet = new WallsSpriteSheet(image, 64, 64)

    }

    drawStrip(textureID, textureX, x, y, width, height, isDark) {

        this.ctx.drawImage(this.wallsSpriteSheet.getWall(textureID, isDark), textureX, 0, width, 63, x, y, width, height);
    }
}
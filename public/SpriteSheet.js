export default class SpriteSheet {
    constructor(image) {
        this.image = image;

        this.textures = [];
    }

    defineAll(width, height) {
        console.log(this.image)
        let texturesY = this.image.height / height;
        let texturesX = this.image.width / width;
        for (let y = 0; y < texturesY; y++)
            for (let x = 0; x < texturesX; x++) {
                let buffer = document.createElement('canvas');
                buffer.width = width;
                buffer.height = height;
                buffer.getContext('2d').drawImage(this.image, x * width, y * height, width, height, 0, 0, width, height);
                this.textures.push(buffer);
            }
    }

    getSprite(id) {
        return this.textures[id];
    }


}
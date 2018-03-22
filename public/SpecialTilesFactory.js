import SpecialTile from './SpecialTile.js'

export default class SpecialTilesFactory {
    constructor(settings) {
        this.settings = settings;
    }

    setLevel(tilesArray) {
        this.tilesArray = tilesArray;
    }

    createTilesAndEvents(map) {
        for (let tile of this.tilesArray) {
            console.log(tile)
            map.pushNewSpecialTile(this.createTile(tile))
        }
    }

    createTile(tile) {
        let settings = this.findInSettings(tile.type)
        console.log(settings)
        let renderArr = []
        for (let i = 0; i < settings.render.length; i++) {
            let x = tile.x;
            let y = tile.y;
            let rotation = settings.render[i].rotation;

            switch (tile.rotation) {
                case 0:
                    x += settings.render[i].x
                    y += settings.render[i].y
                    break;
                case 1:
                    y += settings.render[i].x
                    x += settings.render[i].y
                    rotation = !rotation
                    break;
                case 2:
                    x -= settings.render[i].x
                    y -= settings.render[i].y
                    break;
                case 3:
                    y -= settings.render[i].x
                    x -= settings.render[i].y
                    rotation = !rotation
                    break;
            }

            let render = {
                x: x,
                y: y,
                rotation: rotation,
                wallID:
                settings.render[i].wallID,
                dark:
                settings.render[i].dark,
                additionalDistance:
                settings.render[i].additionalDistance
            }
            renderArr.push(render)
        }
        return new SpecialTile(tile.x, tile.y, renderArr, tile.type)

    }

    findInSettings(type) {
        for (let i = 0; i < this.settings.tiles.length; i++) {
            if (this.settings.tiles[i].type === type)
                return this.settings.tiles[i]

        }

    }

}
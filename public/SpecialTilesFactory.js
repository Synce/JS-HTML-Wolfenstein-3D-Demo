import SpecialTile from './SpecialTile.js'
import Event from './Event.js'


export default class SpecialTilesFactory {
    constructor(settings, eventHandler) {
        this.settings = settings;
        this.eventHandler = eventHandler;
    }

    setLevel(tilesArray) {
        this.tilesArray = tilesArray;
    }

    createTilesAndEvents(map) {
        for (let tile of this.tilesArray) {
            let settings = this.findInSettings(tile.type)
            let object = this.createTile(tile, settings);
            map.pushNewSpecialTile(object)
            this.eventHandler.pushEvent(new Event(settings.event, tile.x, tile.y, object))
        }
    }

    createTile(tile, settings) {

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
                settings.render[i].additionalDistance,
                translate: 0,
                offsetX: settings.render[i].offsetX || 0,
                offsetY: settings.render[i].offsetY || 0,
                skip: settings.render[i].skip || false,
                update: settings.render[i].update || false
            }
            renderArr.push(render)
        }
        if (tile.move)
            return new SpecialTile(tile.x, tile.y, renderArr, tile.type, tile.move)
        return new SpecialTile(tile.x, tile.y, renderArr, tile.type)

    }

    findInSettings(type) {
        for (let i = 0; i < this.settings.tiles.length; i++) {
            if (this.settings.tiles[i].type === type)
                return this.settings.tiles[i]

        }

    }

}
export default class Map {
    constructor() {
        this.map = [[]];
        this.objects = [];
        this.specialTiles = [];
    }

    loadMap(map) {
        this.map = map;
    }

    getMapSize() {
        return {x: this.map[0].length, y: this.map.length}
    }

    getMap() {
        return this.map;
    }

    getObjects() {
        return this.objects;
    }

    getSpecialTiles() {
        return this.specialTiles;
    }

    pushNewObject(object) {
        this.objects.push(object)
    }

    pushNewSpecialTile(tile) {
        this.specialTiles.push(tile);
    }
}
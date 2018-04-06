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

    checkForCollisions(y, x) {

        if (y < 0 || x < 0 || y >= this.map.length || x >= this.map[y].length)
            return true
        if (this.map[y][x] > 0)
            return true
        for (let object of this.objects) {

            if (object.position.x == x && object.position.y == y && !object.walkable)
                return true;

        }
        for (let tile of this.specialTiles) {
            if (tile.x == x && tile.y == y && !tile.walkable)
                return true;
        }
        return false;
    }
}
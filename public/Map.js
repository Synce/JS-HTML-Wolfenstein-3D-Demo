export default class Map {
    constructor() {
        this.map = [[]];
        this.objects = [];
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

    pushNewObject(object) {
        this.objects.push(object)
    }
}
export default class PathNode {
    constructor(_walkable, x, y, doors = false) {
        this.walkable = _walkable
        this.x = x;
        this.doors = doors
        this.y = y;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;


    }

    getFCost() {
        return this.gCost + this.hCost;
    }
}
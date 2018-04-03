export default class PathNode {
    constructor(_walkable, x, y) {
        this.walkable = _walkable
        this.x = x;
        this.y = y;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;


    }

    getFCost = function () {
        return this.gCost + this.hCost;
    }
}
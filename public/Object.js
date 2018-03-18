export default class Object {
    constructor(x, y, id, walkable) {
        this.position = {
            x: x,
            y: y,
        }
        this.id = id;
        this.walkable = walkable;
        this.drawed = false;
        this.onStandCallback = function () {
        }
    }

    setOnStandCallback(cb) {
        this.onStandCallback = cb;
    }

    onStand() {
        this.onStandCallback();
    }

    setDrawed(state) {
        this.drawed = state;
    }


}
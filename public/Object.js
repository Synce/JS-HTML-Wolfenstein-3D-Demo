export default class Object {
    constructor(x, y, id, walkable, player, cb) {
        this.position = {
            x: x,
            y: y,
        }
        this.id = id;
        this.walkable = walkable;
        this.player = player;
        this.cb = cb;
    }


    onStand(map) {
        console.log(this)
        if (this.cb.name) {
            this.player[this.cb.name](this.cb.val);
            map.removeObject(this)
        }
    }


}
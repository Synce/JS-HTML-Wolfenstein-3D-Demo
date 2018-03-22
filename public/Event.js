export default class Event {
    constructor(action, x, y, object) {
        this.action = action;
        this.x = x;
        this.y = y;
        this.object = object;
    }
}
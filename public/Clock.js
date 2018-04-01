export default class Clock {
    constructor() {
        this.time = Date.now();
    }

    getDeltaTime() {
        let deltaTime = (Date.now() - this.time) / 1000;
        this.time = Date.now();
        return deltaTime;

    }
}
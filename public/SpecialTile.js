import TimeHelper from "./TimeHelper.js";

export default class SpecialTile {
    constructor(x, y, render, type) {
        this.x = x;
        this.y = y;
        this.render = render;
        this.type = type;
        this.state = 0;
        this.timeHelper = new TimeHelper(1, 64)
        this.walkable = false;
        this.needsFix = false;
    }

    openDoors(time, x, y) {
        if (this.state != 0 && this.state != 3) {

            if (this.needsFix) {
                if (this.state === 1)
                    this.timeHelper.fix(this.render[2].translate)
                else
                    this.timeHelper.fix(64 - this.render[2].translate)

                this.needsFix = false;
            }
            switch (this.state) {
                case 1: {
                    this.render[2].translate = this.timeHelper.update(time)
                    this.wait = null;
                    break;
                }
                case 2: {
                    this.render[2].translate = 64 - this.timeHelper.update(time);
                    this.wait = null;
                    break;
                }
            }


            if (this.render[2].translate === 64) {
                this.walkable = true;
                this.state = 3;
                this.wait = new TimeHelper(3, 1)
                this.timeHelper.reset()
            }
            else if (this.render[2].translate === 0) {
                this.state = 0;
                this.walkable = false;
                this.timeHelper.reset()
            }
            else {
                this.walkable = false;
            }
        }
        let distance = Math.sqrt(Math.pow(this.y + 0.5 - y, 2) + Math.pow(this.x + 0.5 - x, 2))
        if (this.wait && this.wait.update(time) === 1 && distance >= .7) {
            this.wait = null;
            this.state = 2;
        }
    }

}
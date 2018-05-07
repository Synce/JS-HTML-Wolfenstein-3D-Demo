import TimeHelper from "./TimeHelper.js";


export default class SpecialTile {
    constructor(x, y, render, type, player, entities, move = {}, wallID = 2) {
        this.x = x;
        this.y = y;
        this.render = render;
        this.type = type;
        this.state = 0;
        this.wallID = wallID;
        this.moveTo = move;
        this.offsetX = 0;
        this.offsetY = 0;
        this.player = player;
        this.entities = entities;
        this.timeHelper = new TimeHelper(1, 64)
        this.walkable = false;
        this.needsFix = false;
    }

    openDoors(time) {
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


        let distance = Math.sqrt(Math.pow(this.y + 0.5 - this.player.y, 2) + Math.pow(this.x + 0.5 - this.player.x, 2))
        for (let entity of this.entities) {
            let bufor = Math.sqrt(Math.pow(this.y + 0.5 - entity.y, 2) + Math.pow(this.x + 0.5 - entity.x, 2))
            if (bufor < distance)
                distance = bufor;
        }

        if (this.wait && this.wait.update(time) === 1 && distance >= .7) {
            this.wait = null;
            this.state = 2;
        }
    }

    open(i = false) {
        if (!i) {
            switch (this.state) {
                case 0: {
                    this.state++
                    break;
                }
                case 1: {
                    this.state++
                    this.needsFix = true;
                    break;
                }
                case 2: {
                    this.state--
                    this.needsFix = true;
                    break;
                }
                case 3: {
                    this.state--;
                    break;
                }
            }
        }
        else {
            switch (this.state) {
                case 0: {
                    this.state++
                    break;
                }
                case 2: {
                    this.state--
                    this.needsFix = true;
                    break;
                }

            }
        }
    }


}
import PathFinder from "./PathFinder.js";
import {clampAngle} from "./Utilities.js";
import TimeHelper from "./TimeHelper.js";

export default class Entity {
    constructor(type, hp, stun, points, animations, damage, speed, range, x, y, rotation, patrol = false) {
        this.hp = hp;
        this.type = type;
        this.stun = stun;
        this.points = points;
        this.animations = animations;
        this.damage = damage;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.patrol = patrol;
        this.rotation = rotation;
        this.range = range;
        this.range = range;
        if (!patrol) {
            this.state = 'stand'
        }
        this.frame = 0;
        this.triggered = true;
        this.path = [];
        this.moving = false;
        this.frameUpdater = null;
    }

    applyPath(path) {
        this.path = path;
    }

    move(time, map, minimap) {
        if (this.path.length > 0 && Math.pow(this.path[0].x - this.x, 2) + Math.pow(this.path[0].y - this.y, 2) < Math.pow(this.speed * time, 2)) {
            this.path.shift()
        }


        if (this.path.length > 0) {
            if (!this.moving) {
                this.moving = true;
                let frames = this.animations['move'].frames - 1
                this.frameUpdater = new TimeHelper(frames * 0.2, frames)
            }
            if (this.frame == this.animations['move'].frames - 1) {
                this.frameUpdater.reset();
            }
            this.frame = Math.floor(this.frameUpdater.update(time));
            console.log(this.frame)


            let g = {x: this.x, y: this.y}
            for (let node of this.path) {
                minimap.drawLine(g.x, g.y, node.x, node.y)
                g = node;
            }
            this.state = 'move'
            let move = this.speed * time;

            let angle = Math.atan2(this.path[0].y - this.y, this.path[0].x - this.x);
            this.rotation = -angle


            let goX = this.x + Math.cos(angle) * move;
            let goY = this.y + Math.sin(angle) * move;
            let pos = PathFinder.checkCollisions(goX, goY, .2, map)
            this.x = pos.x > 0 ? pos.x : this.x;
            this.y = pos.y > 0 ? pos.y : this.y;

        }
        else {
            this.frame = 0;
            this.state = 'stand'
        }


    }


}
import PathFinder from "./PathFinder.js";
import {clampAngle} from "./Utilities.js";
import TimeHelper from "./TimeHelper.js";
import RayCaster from "./Raycaster.js";
import Weapon from "./Weapon.js";
import {checkIfInAngle} from "./Utilities.js";

export default class Entity {
    constructor(type, hp, stun, points, animations, damage, speed, range, x, y, rotation, patrol = false, factory, doors, diagonal) {
        this.hp = hp;
        this.type = type;
        this.stun = stun;
        this.points = points;
        this.animations = animations;
        this.damage = damage;
        this.speed = speed;
        this.x = x;
        this.objFactory = factory;
        this.doors = doors;
        this.diagonal = diagonal;
        this.y = y;
        this.patrol = patrol;

        this.rotation = rotation;
        this.range = range;
        if (!patrol) {
            this.state = 'stand'
        } else {
            this.state = 'move'
            this.patrolWay = true;
            this.prePatrol = {
                x: this.x,
                y: this.y,
            }
        }

        this.frame = 0;
        this.triggered = false;
        this.path = [];
        this.moving = false;
        this.frameUpdater = null;
        this.dead = false;
        this.stunTimer = new TimeHelper(0.24, 1)
        this.stunTimer.actualNumber = 1;
        this.shootTimer = new TimeHelper(0.6, 1)
        this.shot = false;
    }

    applyPath(path) {
        this.path = path;

    }

    update(time, map, minimap, player, entities) {

        if (!this.triggered) {
            this.trigger(player, map)
        } else {
            for (let entity of entities) {
                if (!entity.triggered)
                    entity.trigger(player, map, true)
            }
        }

        if (this.dead)
            minimap.addPoint(this.x, this.y, "rgb(30, 7, 58)")
        else
            minimap.addPoint(this.x, this.y, "rgb(247, 9, 239)")

        if (this.dead) {
            if (!this.frameUpdater || this.state != 'death') {
                let frames = this.animations['death'].frames
                this.frameUpdater = new TimeHelper(frames * 0.1, frames)
            }

            if (this.frame == this.animations['death'].frames - 1) {

                this.frame = this.animations['death'].frames - 1;
            } else {
                this.frame = Math.floor(this.frameUpdater.update(time));
            }
            this.state = 'death'
        }
        else if (this.stunTimer && this.stunTimer.update(time) != 1) {
            this.shot = false;
            this.frame = 0;
            this.state = 'stun'
            this.moving = false
        }
        else if (this.triggered && Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)) < this.range && !RayCaster.castRay({
                x: this.x,
                y: this.y
            }, {
                x: player.x,
                y: player.y,
            }, map, true)) {

            this.moving = false;

            if (this.shootTimer && this.shootTimer.update(time) == 1) {


                if (!this.frameUpdater || this.state != 'attack') {


                    let frames = this.animations['attack'].frames
                    this.frameUpdater = new TimeHelper(frames * 0.2, frames)
                }

                this.frame = Math.floor(this.frameUpdater.update(time));
                if (this.frame == 2 && !this.shot) {
                    this.shot = true;
                    let distX = this.x - player.x;
                    let distY = this.y - player.y;
                    let dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
                    let angle = Math.atan2(distY, distX) - player.rotation
                    player.hit(Weapon.dealDMGNPC(dist, checkIfInAngle(angle, Math.radians(60)), player.speed))

                }

                if (this.frame == this.animations['attack'].frames) {
                    this.frameUpdater.reset();
                    this.shootTimer.reset()
                    this.frame = 1;
                }
                this.state = 'attack'
            }
            else {
                this.shot = false;
                this.state = 'attack'
                this.frame = 1;
            }
            let angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.rotation = -angle
            this.path = [];
        } else {
            this.shot = false;
            this.move(time, map, minimap)
        }

    }

    move(time, map, minimap) {
        if (this.path.length > 0 && Math.pow(this.path[0].x - this.x, 2) + Math.pow(this.path[0].y - this.y, 2) < Math.pow(this.speed * time, 2)) {
            this.path.shift()
        }


        if (this.path.length > 0) {
            let dist = Math.sqrt(Math.pow(this.path[0].x - this.x, 2) + Math.pow(this.path[0].y - this.y, 2));

            if (this.path[0].doors && dist < 1.8 && this.doors) {
                let doors = map.getSpecialTile(Math.floor(this.path[0].y), Math.floor(this.path[0].x))
                doors.open(true)

            }

            if (!this.moving) {
                this.moving = true;
                let frames = this.animations['move'].frames
                this.frameUpdater = new TimeHelper(frames * 0.2 / this.speed, frames)
            }

            this.frame = Math.floor(this.frameUpdater.update(time));
            if (this.frame == this.animations['move'].frames) {
                this.frameUpdater.reset();
                this.frame = 0;
            }

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

    hit(dmg, player) {
        this.triggered = true;
        this.hp -= dmg;
        if (this.hp < 0) {
            this.dead = true;
            player.giveScore(100, false)

            if (this.type != 'dog')
                this.objFactory.createObject(28, Math.floor(this.x), Math.floor(this.y));


        }
        if (this.stun) {
            this.stunTimer.reset()
        }
    }

    trigger(player, map, skip = false) {

        if (!RayCaster.castRay({x: this.x, y: this.y}, {
                x: player.x,
                y: player.y,
            }, map, true)) {
            let distX = player.x - this.x;
            let distY = player.y - this.y;

            let angle = Math.atan2(distY, distX) + this.rotation

            if (skip || checkIfInAngle(clampAngle(angle), Math.radians(30))) {

                this.path = [];
                this.moving = false
                this.frame = 0;
                this.state = 'stand'
                this.triggered = true;
            }
        }

    }


}
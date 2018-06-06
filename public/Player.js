import {clampAngle} from "./Utilities.js";
import PathFinder from "./PathFinder.js";
import TimeHelper from "./TimeHelper.js";
import {checkIfInAngle} from "./Utilities.js";
import Heap from "./Heap.js";
import Weapon from "./Weapon.js";
import RayCaster from "./Raycaster.js";

export default class Player {
    constructor(x, y, moveSpeed, rotSpeed, lives) {
        this.x = x;
        this.y = y;
        this.direction = 0;	//  lewo(-1) / prawo(1)
        this.rotation = 0;		// obecny kąt
        this.speed = 0;	// poruszanie do przodu (1) do tyłu (-1)
        this.moveSpeed = moveSpeed	// szybkosc poruszania sie na tick
        this.rotSpeed = Math.radians(rotSpeed)	// szybkosc obracania sie na tick;
        this.hp = 100;

        this.score = 0;
        this.lvl = 1;
        this.lives = lives;
        this.weapon = 2;
        this.ammo = 8;
        this.weapons = [];
        this.shooting = false;
        this.weaponFrame = 0;
        this.frameUpdater = null;
        this.shooted = false;
        this.pickUp = null;
    }

    move(map, time) {

        let move = this.speed * this.moveSpeed * time;
        if (move > 0.5)
            move = 0.3
        this.rotation += this.direction * this.rotSpeed * time;
        this.rotation = clampAngle(this.rotation)

        let goX = this.x + Math.cos(this.rotation) * move;
        let goY = this.y + Math.sin(this.rotation) * move;
        let pos = PathFinder.checkCollisions(goX, goY, .4, map, this.minimap)
        this.x = pos.x > 0 ? pos.x : this.x;
        this.y = pos.y > 0 ? pos.y : this.y;
        for (let object of map.getObjects()) {

            if (Math.floor(this.x) == object.position.x && Math.floor(this.y) == object.position.y) {

                object.onStand(map);
            }
        }
    }


    getInfoForRayCast() {
        return {
            x: this.x,
            y: this.y,
            rot: this.rotation,
        }
    }

    update(time, map, handler) {
        if (this.hp > 0) {
            if (this.pickUp) {
                if (this.pickUp.update(time) == 1) {
                    this.pickUp = null;
                }

            }

            this.move(map, time)
            if (this.shooting && this.frameUpdater == null && (!this.shooted || !this.weapons[this.weapon - 1].single) && (this.weapon == 1 || this.ammo > 0)) {
                this.frameUpdater = new TimeHelper(this.weapons[this.weapon - 1].frame * 4, 3);
                let entites = handler.getEntites()
                if (this.weapon != 1)
                    this.ammo--;
                let heap = new Heap(function (x) {
                    return x.dist;
                });
                for (let i = 0; i < entites.length; i++) {
                    if (!entites[i].dead) {
                        let distX = entites[i].x - this.x;
                        let distY = entites[i].y - this.y;
                        let dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
                        entites[i].dist = dist;
                        let angle = Math.atan2(distY, distX) - this.rotation

                        if (checkIfInAngle(clampAngle(angle), Math.radians(15)) && !RayCaster.castRay({
                                x: this.x,
                                y: this.y
                            }, {
                                x: entites[i].x + .5,
                                y: entites[i].y + .5
                            }, map, true)) {
                            entites[i].trigger(this, map);
                            heap.push(entites[i])
                        }
                    }
                }
                let target = heap.pop()
                if (target) {
                    if (this.weapon != 1) {
                        target.hit(Weapon.dealDMG(target.dist), this, map)
                    }
                    else if (target.dist < 2) {
                        target.hit(Math.RNG(0, 255) / 16, this, map)
                    }
                }
                this.shooted = true;
            } else if (this.frameUpdater) {
                this.weaponFrame = Math.floor(this.frameUpdater.update(time));
                if (this.weaponFrame == 3) {
                    this.frameUpdater = null
                    this.weaponFrame = 0;
                }

            }
            else if (!this.shooting && this.frameUpdater == null) {
                this.shooted = false;
            }
        }

    }

    changeWeapon(id) {
        if (id != this.weapon && this.weapons[id - 1].obtained && !this.shooting && this.frameUpdater == null) {
            this.weapon = id
        }
    }

    giveAmmo(val) {
        this.pickUp = new TimeHelper(0.1, 1)
        this.ammo += val
    }

    giveHp(val) {
        this.pickUp = new TimeHelper(0.1, 1)
        this.hp += val
        if (this.hp > 100) {
            this.hp = 100;
        }
    }

    giveScore(val, flash = true) {
        if (flash)
            this.pickUp = new TimeHelper(0.1, 1)
        this.score += val


    }

    giveWeapon(val) {
        this.weapons[val - 1].obtained = true;


    }

    hit(dmg) {
        this.hp -= dmg;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }


}



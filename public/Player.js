import {clampAngle} from "./Utilities.js";
import PathFinder from "./PathFinder.js";

export default class Player {
    constructor(x, y, moveSpeed, rotSpeed) {
        this.x = x;
        this.y = y;
        this.direction = 0;	//  lewo(-1) / prawo(1)
        this.rotation = 0;		// obecny kąt
        this.speed = 0;	// poruszanie do przodu (1) do tyłu (-1)
        this.moveSpeed = moveSpeed	// szybkosc poruszania sie na tick
        this.rotSpeed = Math.radians(rotSpeed)	// szybkosc obracania sie na tick;
        this.go = {
            x: 0,
            y: 0
        }
    }

    move(map, time) {
        let move = this.speed * this.moveSpeed * time;

        this.rotation += this.direction * this.rotSpeed * time;
        this.rotation = clampAngle(this.rotation)

        let goX = this.x + Math.cos(this.rotation) * move;
        let goY = this.y + Math.sin(this.rotation) * move;
        let pos = PathFinder.checkCollisions(goX, goY, .4, map, this.minimap)
        this.x = pos.x > 0 ? pos.x : this.x;
        this.y = pos.y > 0 ? pos.y : this.y;
    }


    getInfoForRayCast() {
        return {
            x: this.x,
            y: this.y,
            rot: this.rotation,
        }
    }


}



import {clampAngle} from "./Utilities.js";

export default class Player {
    constructor(x, y, moveSpeed, rotSpeed) {
        this.x = x;
        this.y = y;
        this.direction = 0;	//  lewo(-1) / prawo(1)
        this.rotation = 0;		// obecny kąt
        this.speed = 0;	// poruszanie do przodu (1) do tyłu (-1)
        this.moveSpeed = moveSpeed	// szybkosc poruszania sie na tick
        this.rotSpeed = Math.radians(rotSpeed)	// szybkosc obracania sie na tick;
    }

    move() {
        let moveStep = this.speed * this.moveSpeed;	// this will move this far along the current direction vector

        this.rotation += this.direction * this.rotSpeed; // add rotation if this is rotating (this.dir != 0)
        this.rotation = clampAngle(this.rotation)
        console.log(Math.degrees(this.rotation))
        let newX = this.x + Math.cos(this.rotation) * moveStep;	// calculate new this position with simple trigonometry
        let newY = this.y + Math.sin(this.rotation) * moveStep;

        //  if (collisionCheck(newX, newY)) {	// are we allowed to move to the new position?
        //       return; // no, bail out.
        //   }

        this.x = newX; // set new position
        this.y = newY;

        function collisionCheck(x, y) {
            // first make sure that we cannot move outside the boundaries of the level
            if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth)
                return true;

            // return true if the map block is not 0, ie. if there is a blocking wall.
            return (map[Math.floor(y)][Math.floor(x)] != 0);
        }
    }

    getInfoForRayCast() {
        return {
            x: this.x,
            y: this.y,
            rot: this.rotation,
        }
    }


}



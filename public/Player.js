import {clampAngle, RectCirCollision} from "./Utilities.js";

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

    move(map) {
        let move = this.speed * this.moveSpeed;

        this.rotation += this.direction * this.rotSpeed;
        this.rotation = clampAngle(this.rotation)

        let goX = this.x + Math.cos(this.rotation) * move;
        let goY = this.y + Math.sin(this.rotation) * move;

        let x = Math.floor(goX)
        let y = Math.floor(goY)
        if (y > 0 && y < map.getMapSize().y && x > 0 && x < map.getMapSize().x) {


            let right = (this.rotation > Math.PI * 2 * 0.75 || this.rotation < Math.PI * 2 * 0.25);
            let up = (this.rotation < 0 || this.rotation > Math.PI);

            let checkX, checkY

            if ((right && this.speed > 0) || (!right && this.speed < 0))
                checkX = 1;
            else
                checkX = -1;
            if ((up && this.speed > 0) || (!up && this.speed < 0))
                checkY = -1;
            else
                checkY = 1;


            let check = true;

            if (map.getMap()[y + checkY][x] > 0 && RectCirCollision(x, y + checkY, this.x, goY, 0.4)) {
                this.y = checkY > 0 ? y + 0.6 : y + 0.4
                check = false;
            }
            else
                this.y = goY;

            if (map.getMap()[y][x + checkX] > 0 && RectCirCollision(x + checkX, y, goX, this.y, 0.4)) {
                this.x = checkX > 0 ? x + 0.6 : x + 0.4
                check = false;  
            }
            else
                this.x = goX;

            let angle = this.rotation % Math.PI


            if (check && map.getMap()[y + checkY][x + checkX] > 0 && RectCirCollision(x + checkX, y + checkY, goX, goY, 0.4)) {
                if (angle > Math.Pi / 4)
                    this.y = checkY > 0 ? y + 0.6 : y + 0.4
                else
                    this.x = checkX > 0 ? x + 0.6 : x + 0.4
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


}



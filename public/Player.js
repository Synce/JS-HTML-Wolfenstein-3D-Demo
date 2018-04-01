import {clampAngle, RectCirCollision, RectCirDist} from "./Utilities.js";

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
        let that = this;
        this.rotation += this.direction * this.rotSpeed * time;
        this.rotation = clampAngle(this.rotation)

        let goX = this.x + Math.cos(this.rotation) * move;
        let goY = this.y + Math.sin(this.rotation) * move;
        this.go = {
            x: goX,
            y: goY
        }
        let x = Math.floor(goX)
        let y = Math.floor(goY)
        if (y > 0 && y < map.getMapSize().y && x > 0 && x < map.getMapSize().x) {

            function checkBlock(checkY, checkX, y, x, r = 0.4) {
                if ((map.getMap()[checkY][checkX] > 0 || that.checkForOtherCollision(checkX, checkY, map.getObjects(), map.getSpecialTiles())) && RectCirCollision(checkX, checkY, x, y, r))
                    return true;
                return false;
            }

            this.y = goY;
            this.x = goX;


            for (let i = -1; i <= 1; i++) {
                if (checkBlock(y, x + i, goY, goX, .4)) {
                    this.x = i > 0 ? x + 1 - .4 : x + 0.4
                    this.minimap.addActiveBlock(x + i, y, 'rgba(33, 23, 181,0.5)')

                } else {
                    this.minimap.addActiveBlock(x + i, y, 'rgba(23, 181, 47,0.5)')
                }
                if (checkBlock(y + i, x, goY, goX, .4)) {
                    this.y = i > 0 ? y + 1 - .4 : y + .4

                    this.minimap.addActiveBlock(x, y + i, 'rgba(33, 23, 181,0.5)')
                } else {
                    this.minimap.addActiveBlock(x, y + i, 'rgba(23, 181, 47,0.5)')
                }
            }

            for (let checkX = -1; checkX <= 1; checkX++)
                for (let checkY = -1; checkY <= 1; checkY++)

                    if (checkX !== 0 && checkY !== 0) {
                        let dist = RectCirDist(x + checkX, y + checkY, this.x, this.y)
                        if (checkBlock(y + checkY, x + checkX, this.y, this.x, .4) && !((map.getMap()[y][x + checkX] > 0 || that.checkForOtherCollision(x + checkX, y, map.getObjects(), map.getSpecialTiles())) || (map.getMap()[y + checkY][x] > 0 || that.checkForOtherCollision(x, y + checkY, map.getObjects(), map.getSpecialTiles())))) {
                            
                            if (Math.abs(dist.x) < Math.abs(dist.y)) {
                                let d = Math.sqrt((0.16 - dist.x * dist.x));

                                d = dist.y < 0 ? -d : d;
                                d = dist.y < 0 ? Math.abs(dist.y) + d : d - dist.y;
                                this.y += d
                            }
                            else {
                                let d = Math.sqrt((0.16 - dist.y * dist.y));

                                d = dist.x < 0 ? -d : d;
                                console.log(d)
                                console.log(dist.x)
                                d = dist.x < 0 ? Math.abs(dist.x) + d : d - dist.x;
                                console.log(d)
                                this.x += d
                            }


                            this.minimap.addActiveBlock(x + checkX, y + checkY, 'rgba(33, 23, 181,0.5)')
                        } else {
                            this.minimap.addActiveBlock(x + checkX, y + checkY, 'rgba(23, 181, 47,0.5)')
                        }
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

    checkForOtherCollision(x, y, objects, tiles) {
        for (let object of objects) {

            if (object.position.x == x && object.position.y == y && !object.walkable)
                return true;

        }
        for (let tile of tiles) {
            if (tile.x == x && tile.y == y && !tile.walkable)
                return true;
        }
        return false;
    }


}



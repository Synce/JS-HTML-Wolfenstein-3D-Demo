import {clampAngle} from "./Utilities.js";

export default class Raycaster {
    constructor(fov, viewDist, numRays) {
        this.fov = Math.radians(fov);
        this.viewDist = viewDist;
        this.numRays = numRays;
    }

    static castRay(start, meta, map, skip) {


        let Wx = meta.x - start.x;
        let Wy = meta.y - start.y;

        let angle = clampAngle(Math.atan2(Wy, Wx));

        let right = (angle > Math.PI * 2 * 0.75 || angle < Math.PI * 2 * 0.25);
        let up = (angle < 0 || angle > Math.PI);

        let angleTan;
        if (Math.abs(angle) % Math.PI === Math.PI / 2)
            angleTan = 1;
        else if (Math.abs(angle) % Math.PI === 0)
            angleTan = 0;
        else
            angleTan = Math.tan(angle);


        let dXVer = right ? 1 : -1;
        let dYVer = dXVer * angleTan;

        let x = right ? Math.ceil(start.x) : Math.floor(start.x);
        let y = start.y + (x - start.x) * angleTan;


        while ((right && Math.floor(x) < Math.floor(meta.x)) || (!right && Math.floor(x) > Math.floor(meta.x))) {

            let wallX = Math.floor(x + (right ? 0 : -1));
            let wallY = Math.floor(y);


            if (map.checkForCollisions(wallY, wallX, skip))
                return true;


            x += dXVer;
            y += dYVer;
        }


        let angleCtg;
        if (Math.abs(angle) % Math.PI === Math.PI / 2)
            angleCtg = 0;
        else if (Math.abs(angle) % Math.PI === 0)
            angleCtg = 1;
        else
            angleCtg = 1 / angleTan;
        let dYHor = up ? -1 : 1;
        let dXHor = dYHor * angleCtg;
        y = up ? Math.floor(start.y) : Math.ceil(start.y);
        x = start.x + (y - start.y) * angleCtg;

        while ((up && Math.floor(y) > Math.floor(meta.y)) || (!up && Math.floor(y) < Math.floor(meta.y))) {

            let wallY = Math.floor(y + (up ? -1 : 0));
            let wallX = Math.floor(x);


            if (map.checkForCollisions(wallY, wallX, skip))
                return true;

            x += dXHor;
            y += dYHor;
        }

        return false;
    }

}
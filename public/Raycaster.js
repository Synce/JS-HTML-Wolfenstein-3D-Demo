export default class Raycaster {
    constructor(fov, viewDist, numRays) {
        this.fov = Math.radians(fov);
        this.viewDist = viewDist;
        this.numRays = numRays;
    }

    static castRay(start, meta, map) {
        console.log("start", start.x, start.y)
        console.log("meta", meta.x, meta.y)
        let Wx = meta.x - start.x;
        let Wy = meta.y - start.y;

        let dX = Math.floor(Wx);
        let dXVer = dX > 0 ? 1 : -1;
        let dYVer = isFinite(Wy / Math.abs(dX)) ? Wy / Math.abs(dX) : 0;


        let x = start.x;
        let y = start.y;
        while (Math.floor(x) !== Math.floor(meta.x + dXVer)) {

            let wallX = Math.floor(x);
            let wallY = Math.floor(y);
            console.log(wallX, wallY)

            if (map.checkForCollisions(wallY, wallX))
                return true;
            x += dXVer;
            y += dYVer;
        }
        console.log('---')
        let dY = Math.floor(Wy);
        let dYHor = dY > 0 ? 1 : -1;
        let dXHor = isFinite(Wx / Math.abs(dY)) ? Wx / Math.abs(dY) : 0;
        console.log(dY)
        console.log(dXHor)
        x = start.x;
        y = start.y
        while (Math.floor(y) !== Math.floor(meta.y + dYHor)) {

            let wallY = Math.floor(y);
            let wallX = Math.floor(x);
            console.log(wallX, wallY)

            if (map.checkForCollisions(wallY, wallX))
                return true;
            x += dXHor;
            y += dYHor;
        }
        return false;
    }

}
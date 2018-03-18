export default class Raycaster {
    constructor(fov, viewDist, numRays) {
        this.fov = Math.radians(fov);
        this.viewDist = viewDist;
        this.numRays = numRays;
    }
}
import {clampAngle} from "./Utilities.js";

export default class EntityHandler {
    constructor(player) {
        this.entites = [];
        this.player = player
    }

    pushEntity(entity) {
        this.entites.push(entity)
    }

    getEntites() {
        return this.entites;
    }

    getEntityToDraw(id, angle) {
        let g = Math.PI / 4

        let rot = clampAngle((2 * Math.PI - (angle + this.player.rotation + this.entites[id].rotation))) / g;
        rot = Math.round(rot) > 7 ? 0 : Math.round(rot)

        console.log(Math.degrees(clampAngle((2 * Math.PI - (angle + this.player.rotation + this.entites[id].rotation)))))
        let animation = this.entites[id].state + rot
        return {type: this.entites[id].type, animation: animation, frame: this.entites[id].frame}
    }
}
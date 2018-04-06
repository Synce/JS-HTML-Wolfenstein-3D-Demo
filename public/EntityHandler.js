import {clampAngle} from "./Utilities.js";
import PathFinder from "./PathFinder.js";
import TimeHelper from "./TimeHelper.js";

export default class EntityHandler {
    constructor(player, map) {
        this.entites = [];
        this.player = player
        this.map = map;
        this.pathFinder = new PathFinder(map)
        this.b = new TimeHelper(2, 1)
    }

    initPathFinder() {
        this.pathFinder.createPathLayer()
    }

    pushEntity(entity) {
        this.entites.push(entity)
    }

    getEntites() {
        return this.entites;
    }

    getEntityToDraw(id, angle) {
        let g = Math.PI / 4

        let rot = clampAngle(((-(angle + this.player.rotation) - this.entites[id].rotation) + Math.PI)) / g;
        rot = Math.round(rot) > 7 ? 0 : Math.round(rot)

        let animation = this.entites[id].state + rot
        return {type: this.entites[id].type, animation: animation, frame: this.entites[id].frame}
    }

    update(time) {

        for (let entity of this.entites) {

            if (entity.triggered && entity.path.length === 0) {
                entity.applyPath(this.pathFinder.findWay({x: entity.x, y: entity.y}, {
                    x: this.player.x,
                    y: this.player.y
                }))

            }
            entity.move(time, this.map, this.minimap)


        }

    }
}
import {clampAngle} from "./Utilities.js";
import PathFinder from "./PathFinder.js";
import TimeHelper from "./TimeHelper.js";

export default class EntityHandler {
    constructor(player, map, objectfactory) {
        this.entites = [];
        this.player = player
        this.map = map;
        this.pathFinder = new PathFinder(map)

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
        let animation
        let rot = clampAngle(((-(angle + this.player.rotation) - this.entites[id].rotation) + Math.PI)) / g;
        rot = Math.round(rot) > 7 ? 0 : Math.round(rot)
        if (this.entites[id].state == 'stand' || this.entites[id].state == 'move')
            animation = this.entites[id].state + rot
        else
            animation = this.entites[id].state
        return {type: this.entites[id].type, animation: animation, frame: this.entites[id].frame}
    }

    update(time) {

        for (let entity of this.entites) {

            if (entity.triggered && (!entity.diagonal || entity.path.length == 0)) {

                entity.applyPath(this.pathFinder.findWay({x: entity.x, y: entity.y}, {
                    x: this.player.x,
                    y: this.player.y
                }, entity.diagonal))

            } else if (entity.patrol && entity.path.length === 0) {
                if (entity.patrolWay) {
                    entity.patrolWay = false;
                    entity.applyPath(this.pathFinder.findWay({x: entity.x, y: entity.y}, {
                        x: entity.patrol.x,
                        y: entity.patrol.y
                    }, entity.diagonal))
                }
                else {
                    entity.patrolWay = true;
                    entity.applyPath(this.pathFinder.findWay({x: entity.x, y: entity.y}, {
                        x: entity.prePatrol.x,
                        y: entity.prePatrol.y
                    }, entity.diagonal))
                }
            }
            entity.update(time, this.map, this.minimap, this.player, this.getEntites())


        }

    }
}
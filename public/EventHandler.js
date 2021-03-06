import {checkIfInAngle} from './Utilities.js'


export default class EventHandler {
    constructor(player, fov) {
        this.player = player;
        this.fov = fov;
        this.events = [];


    }

    pushEvent(event) {
        this.events.push(event);
    }

    checkForEvents() {
        if (this.player.isSpacebar) {
            this.player.isSpacebar = false;
            for (event of this.events) {

                let angle = Math.atan2(event.y + 0.5 - this.player.y, event.x + 0.5 - this.player.x) - this.player.rotation;
                let distance = Math.sqrt(Math.pow(event.y + 0.5 - this.player.y, 2) + Math.pow(event.x + 0.5 - this.player.x, 2))
                if (distance <= 2 && distance >= 0.7 && checkIfInAngle(angle, this.fov)) {
                    if (event.action == 'openDoors')
                        event.object.open();
                    else
                        this.player.end = true;

                }
            }
        }
    }

    update(time) {
        this.checkForEvents();
        for (event of this.events) {
            event.object[event.action](time, this.player.x, this.player.y)
        }
    }


}
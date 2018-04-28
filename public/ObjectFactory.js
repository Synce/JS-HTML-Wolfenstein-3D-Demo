import Object from './Object.js'


export default class ObjectFactory {
    constructor(settings, player, map) {

        this.settings = settings
        this.player = player
        this.map = map;
    }

    setLevel(objectArray) {
        this.objectArr = objectArray;
    }


    createObjects() {
        for (let i = 0; i < this.objectArr.length; i++) {
            let object = this.objectArr[i]

            this.map.pushNewObject(new Object(object.x, object.y, object.id, this.getInfoAboutCollision(object.id), this.player, this.getInfoAboutCB(object.id)))

        }


    }

    createObject(id, x, y) {
        this.map.pushNewObject(new Object(x, y, id, this.getInfoAboutCollision(id), this.player, this.getInfoAboutCB(id)))
    }

    getInfoAboutCollision(id) {

        return this.settings.settingsWalkable[id];
    }

    getInfoAboutCB(id) {
        if (this.settings['id' + id]) {
            return this.settings['id' + id]
        }
        return {}
    }
}
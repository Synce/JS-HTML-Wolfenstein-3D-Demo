import Object from './Object.js'


export default class ObjectFactory {
    constructor(settings) {

        this.settings = settings
    }

    setLevel(objectArray) {
        this.objectArr = objectArray;
    }


    createObjects(map) {
        for (let i = 0; i < this.objectArr.length; i++) {
            let object = this.objectArr[i]

            map.pushNewObject(new Object(object.x, object.y, object.id, this.getInfoAboutObject(object.id)))

        }


    }

    getInfoAboutObject(id) {

        return this.settings[id];
    }
}
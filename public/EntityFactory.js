import Entity from "./Entity.js"

export default class EnityFactory {
    constructor(settings, handler, objectFactory) {
        this.setttings = settings;
        this.entityHandler = handler;
        this.objF = objectFactory;
    }

    setLevel(entityArray) {
        this.entityArray = entityArray;
    }


    createUnits() {
        for (let entity of this.entityArray) {
            let cfg = this.getProperties(entity.type)
            this.entityHandler.pushEntity(new Entity(entity.type, cfg.hp, cfg.stun, cfg.points, this.countAnimationFrames(cfg.animations), cfg.damage, cfg.speed, cfg.range, entity.x, entity.y, Math.radians(entity.rotation), entity.patrol, this.objF))
        }
    }

    countAnimationFrames(anim) {
        let animations = {};
        let used = [];
        for (let animation in anim) {
            console.log(animation)
            if (animation !== 'type' && !used.includes(name)) {
                let frames = (anim[animation].tX - anim[animation].fX + 1) * (anim[animation].tY - anim[animation].fY + 1)

                let name = animation[animation.length - 1] > 0 ? animation.slice(0, animation.length - 1) : animation

                animations[name] = {};
                animations[name].frames = frames;
                used.push(name)

            }
        }
        return animations;

    }

    getProperties(type) {
        return this.setttings[type];

    }


}
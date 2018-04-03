export default class Entity {
    constructor(type, hp, stun, points, animations, damage, speed, range, x, y, rotation, patrol = false) {
        this.hp = hp;
        this.type = type;
        this.stun = stun;
        this.points = points;
        this.animations = animations;
        this.damage = damage;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.patrol = patrol;
        this.rotation = rotation;
        this.range = range;
        this.range = range;
        if (!patrol) {
            this.state = 'stand'
        }
        this.frame = 0;
        console.log(this.animations)
    }
}
import Weapon from "./Weapon.js";

export default class WeaponFactory {
    constructor(settings, player) {
        for (let name of Object.keys(settings)) {
            let weapon = settings[name]
            player.weapons.push(new Weapon(weapon.hitscan, weapon.img, weapon.start, weapon.single, weapon.frame))
        }
    }
}
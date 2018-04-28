export default class Weapon {
    constructor(hitscan, img, obtained, single, frame) {
        this.hitscan = hitscan;
        this.img = img;
        this.obtained = obtained;
        this.single = single;
        this.frame = frame

    }

    static dealDMGNPC(dist, seeable, playerMoving) {
        let chance = 0;
        let rand = Math.RNG(0, 255)
        if (seeable && !playerMoving)
            chance = 256 - dist * 16
        else if (!seeable && !playerMoving)
            chance = 256 - dist * 8
        else if (seeable && playerMoving)
            chance = 160 - dist * 16
        else if (!seeable && playerMoving)
            chance = 160 - dist * 8
        if (rand < chance && dist < 2) {
            return rand / 4
        }
        else if (rand < chance && dist > 2 && dist < 4) {
            return rand / 8
        } else if (rand < chance && dist > 4) {
            return rand / 16
        }
        else
            return 0
    }

    static dealDMG(dist) {
        let rand = Math.RNG(0, 255)
        if (dist < 2) {
            return rand / 4
        }
        else if (dist > 2 && dist < 4) {
            return rand / 6
        } else if (dist > 4 && rand / 12 > dist) {
            return rand / 6
        }
        else
            return 0
    }
}
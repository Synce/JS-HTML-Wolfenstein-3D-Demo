export default class Keyboard {
    constructor(player) {
        this.player = player;
        this.pressedKeys = [];

    }

    bindKeysInGame() {
        document.addEventListener('keydown', bindInGameKeyDown)
        let that = this;

        function bindInGameKeyDown(e) {
            if (!that.pressedKeys.includes(e.keyCode))
                that.pressedKeys.push(e.keyCode)
            if (e.keyCode === 32)
                that.player.isSpacebar = true;
        }

        document.addEventListener('keyup', bindInGameKeyUp)

        function bindInGameKeyUp(e) {
            that.pressedKeys.splice(that.pressedKeys.indexOf(e.keyCode), 1);
            if (e.keyCode === 32)
                that.player.isSpacebar = false;
        }
    }

    update() {

        if (this.pressedKeys.includes(37) && !this.pressedKeys.includes(39))
            this.player.direction = -1;
        else if (this.pressedKeys.includes(39) && !this.pressedKeys.includes(37))
            this.player.direction = 1;
        else
            this.player.direction = 0;

        if (this.pressedKeys.includes(38) && !this.pressedKeys.includes(40))
            this.player.speed = 1;
        else if (this.pressedKeys.includes(40) && !this.pressedKeys.includes(38))
            this.player.speed = -1;
        else
            this.player.speed = 0;

        if (this.pressedKeys.includes(88)) {
            this.player.shooting = true;
        }
        else
            this.player.shooting = false;
        if (this.pressedKeys.includes(49)) {
            this.player.changeWeapon(1);
        } else if (this.pressedKeys.includes(50)) {
            this.player.changeWeapon(2);
        } else if (this.pressedKeys.includes(51)) {
            this.player.changeWeapon(3);
        }
    }
}




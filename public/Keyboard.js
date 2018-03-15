export default class Keyboard {
    constructor(player) {
        this.player = player;

    }

    bindKeysInGame() {
        document.addEventListener('keydown', bindInGameKeyDown)
        let that = this;

        function bindInGameKeyDown(e) {


            switch (e.keyCode) { // which key was pressed?

                case 38: // up, move player forward, ie. increase speed
                    that.player.speed = 1;
                    break;

                case 40: // down, move player backward, set negative speed
                    that.player.speed = -1;
                    break;

                case 37: // left, rotate player left
                    that.player.direction = -1;
                    break;

                case 39: // right, rotate player right
                    that.player.direction = 1;
                    break;
            }
        }

        document.addEventListener('keyup', bindInGameKeyUp)

        function bindInGameKeyUp(e) {
            switch (e.keyCode) {
                case 38:
                case 40:
                    that.player.speed = 0;	// stop the player movement when up/down key is released
                    break;
                case 37:
                case 39:
                    that.player.direction = 0;
                    break;
            }
        }
    }
}



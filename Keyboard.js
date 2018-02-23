class Keyboard {
    constructor() {

    }

    bindKeysInGame() {
        document.addEventListener('keydown', bindInGameKeyDown)

        function bindInGameKeyDown(e) {


            switch (e.keyCode) { // which key was pressed?

                case 38: // up, move player forward, ie. increase speed
                    player.speed = 1;
                    break;

                case 40: // down, move player backward, set negative speed
                    player.speed = -1;
                    break;

                case 37: // left, rotate player left
                    player.dir = -1;
                    break;

                case 39: // right, rotate player right
                    player.dir = 1;
                    break;
            }
        }

        document.addEventListener('keyup', bindInGameKeyUp)

        function bindInGameKeyUp(e) {
            switch (e.keyCode) {
                case 38:
                case 40:
                    player.speed = 0;	// stop the player movement when up/down key is released
                    break;
                case 37:
                case 39:
                    player.dir = 0;
                    break;
            }
        }
    }
}




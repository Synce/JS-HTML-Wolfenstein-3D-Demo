export default class Minimap {
    constructor(canvas, player, map) {
        this.canvas = canvas;
        this.player = player;
        this.map = map;
        this.ctx = canvas.getContext('2d')
        canvas.width = this.map.getMapSize().x * 20;
        canvas.height = this.map.getMapSize().y * 20;
        this.activeBlocks = [];
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let y = 0; y < this.map.getMapSize().y; y++) {
            for (let x = 0; x < this.map.getMapSize().x; x++) {

                let wall = this.map.getMap()[y][x];

                if (wall > 0) {

                    this.ctx.fillStyle = "rgb(200,200,200)";
                    this.ctx.fillRect(
                        x * 20,
                        y * 20,
                        20, 20
                    );

                }
            }
        }
        for (let block of this.activeBlocks) {
            this.ctx.fillStyle = block.color;
            this.ctx.fillRect(
                block.x * 20,
                block.y * 20,
                20, 20
            );
        }

        for (let y = 0; y < this.map.getMapSize().y; y++) {
            for (let x = 0; x < this.map.getMapSize().x; x++) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(x * 20, 0);
                this.ctx.lineTo(x * 20, this.canvas.height);

                this.ctx.moveTo(0, y * 20);
                this.ctx.lineTo(this.canvas.width, y * 20);
                this.ctx.stroke();

            }
        }


        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(200,0,0,0.5)";
        this.ctx.arc(this.player.go.x * 20, this.player.go.y * 20, 8, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(0,0,250)";
        this.ctx.arc(this.player.x * 20, this.player.y * 20, 2, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(0,0,250)";
        this.ctx.arc(this.player.go.x * 20, this.player.go.y * 20, 2, 0, 2 * Math.PI, false);
        this.ctx.fill();

        this.activeBlocks = [];

    }

    addActiveBlock(x, y, color) {
        this.activeBlocks.push({x: x, y: y, color: color})
    }
}
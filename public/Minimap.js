export default class Minimap {
    constructor(canvas, player, map) {
        this.canvas = canvas;
        this.player = player;
        this.map = map;
        this.ctx = canvas.getContext('2d')
        canvas.width = this.map.getMapSize().x * 10;
        canvas.height = this.map.getMapSize().y * 10;
        this.activeBlocks = [];
        this.points = [];
        this.lines = [];
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let y = 0; y < this.map.getMapSize().y; y++) {
            for (let x = 0; x < this.map.getMapSize().x; x++) {

                let wall = this.map.getMap()[y][x];

                if (wall > 0) {

                    this.ctx.fillStyle = "rgb(100,100,100)";
                    this.ctx.fillRect(
                        x * 10,
                        y * 10,
                        10, 10
                    );

                }
            }
        }
        for (let block of this.map.getObjects()) {
            if (block.cb.name) {
                this.ctx.fillStyle = 'rgb(27, 163, 54)';

            } else if (!block.walkable) {
                this.ctx.fillStyle = 'rgb(214, 35, 25)';

            } else {
                this.ctx.fillStyle = 'rgb(195, 214, 26)';
            }
            this.ctx.fillRect(
                block.position.x * 10,
                block.position.y * 10,
                10, 10
            );
        }
        for (let block of this.activeBlocks) {
            this.ctx.fillStyle = block.color;
            this.ctx.fillRect(
                block.x * 10,
                block.y * 10,
                10, 10
            );
        }

        for (let y = 0; y < this.map.getMapSize().y; y++) {
            for (let x = 0; x < this.map.getMapSize().x; x++) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(x * 10, 0);
                this.ctx.lineTo(x * 10, this.canvas.height);

                this.ctx.moveTo(0, y * 10);
                this.ctx.lineTo(this.canvas.width, y * 10);
                this.ctx.stroke();

            }
        }


        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(100,0,0,0.5)";
        this.ctx.arc(this.player.x * 10, this.player.y * 10, 8, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(0,0,250)";
        this.ctx.arc(this.player.x * 10, this.player.y * 10, 2, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb(0,0,250)";
        this.ctx.arc(this.player.x * 10, this.player.y * 10, 2, 0, 2 * Math.PI, false);
        this.ctx.fill();

        this.activeBlocks = [];
        for (let line of this.lines) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "blue";
            this.ctx.lineWidth = 2;
            this.ctx.moveTo(line.sX * 10, line.sY * 10);
            this.ctx.lineTo(line.tX * 10, line.tY * 10);
            this.ctx.fillStyle = "rgb(250,0,0)";
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(line.tX * 10, line.tY * 10, 2, 0, 2 * Math.PI, false);

            this.ctx.fill();

        }
        this.lines = []
        for (let points of this.points) {
            this.ctx.beginPath();
            this.ctx.fillStyle = points.color;
            this.ctx.arc(points.x * 10, points.y * 10, 4, 0, 2 * Math.PI, false);

            this.ctx.fill();

        }
        this.points = [];
    }

    addActiveBlock(x, y, color) {
        this.activeBlocks.push({x: x, y: y, color: color})
    }

    drawLine(sX, sY, tX, tY) {
        this.lines.push({sX: sX, sY: sY, tX: tX, tY: tY})

    }

    addPoint(x, y, color) {
        this.points.push({x, y, color})
    }
}
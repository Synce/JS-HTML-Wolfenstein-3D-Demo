import Raycaster from "./Raycaster.js";
import Player from "./Player.js";
import Map from "./Map.js";
import Keyboard from './Keyboard.js';
import RenderEngine from './RenderEngine.js'
import {loadImage} from "./Utilities.js";

let canvas, ctx, raycaster, player, map, keyborad, renderEngine

addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    canvas.width = 900;
    canvas.height = 500;
    renderEngine = new RenderEngine(canvas)
    raycaster = new Raycaster(60, 1, 900, 500, renderEngine);
    map = new Map();
    raycaster.setMapSize(map.getMapSize().x, map.getMapSize().y)
    console.log(raycaster.mapWidth)
    player = new Player(3, 4, .18, 6);
    keyborad = new Keyboard(player);
    keyborad.bindKeysInGame();

    loadImage('/textures/walls.png').then(function (image) {
        console.log(image)
        renderEngine.loadTextures(image)
        render();
    })

})


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#383838'
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
    ctx.fillStyle = '#707070'
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height)
    player.move();
    raycaster.performRayCast(player.getInfoForRayCast(), map.getMap());
    ctx.moveTo(0, 250)
    ctx.lineTo(canvas.width, 250)
    ctx.stroke();
    requestAnimationFrame(render)
}

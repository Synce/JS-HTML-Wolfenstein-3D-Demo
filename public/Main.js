import Raycaster from "./PlayerRaycaster.js";
import Player from "./Player.js";
import Map from "./Map.js";
import Keyboard from './Keyboard.js';
import RenderEngine from './RenderEngine.js'
import {loadImage} from "./Utilities.js";
import {loadJSON} from "./Utilities.js";
import ObjectFactory from "./ObjectFactory.js";


let canvas, ctx, raycaster, player, map, keyborad, renderEngine, factory

addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    canvas.width = 900;
    canvas.height = 500;
    renderEngine = new RenderEngine(canvas)
    raycaster = new Raycaster(60, 1, 900, 500, renderEngine);
    map = new Map();

    console.log(raycaster.mapWidth)
    player = new Player(3, 4, .1, 4);
    keyborad = new Keyboard(player);
    keyborad.bindKeysInGame();
    Promise.all([
        loadImage('/textures/walls.png'),
        loadImage('/textures/objects.png'),
        loadJSON('/Levels/1-1.JSON'),
        loadJSON('objectSettings.JSON')

    ]).then(
        function ([walls, objects, level, settings]) {
            renderEngine.loadTextures(walls, objects)
            map.loadMap(level.map)
            raycaster.setMapSize(map.getMapSize().x, map.getMapSize().y)
            factory = new ObjectFactory(settings.settingsWalkable)
            factory.setLevel(level.objects);
            factory.createObjects(map)

            render();
        }
    )


})


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    keyborad.update()
    ctx.fillStyle = '#383838'
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
    ctx.fillStyle = '#707070'
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height)
    player.move(map);
    raycaster.performRayCast(player.getInfoForRayCast(), map.getMap(), map.getObjects());
    renderEngine.render()
    requestAnimationFrame(render)
}

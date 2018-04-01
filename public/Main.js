import Raycaster from "./PlayerRaycaster.js";
import Player from "./Player.js";
import Map from "./Map.js";
import Keyboard from './Keyboard.js';
import RenderEngine from './RenderEngine.js'
import {loadImage} from "./Utilities.js";
import {loadJSON} from "./Utilities.js";
import ObjectFactory from "./ObjectFactory.js";
import SpecialTilesFactory from "./SpecialTilesFactory.js";
import EventHandler from "./EventHandler.js";
import Clock from "./Clock.js";
import Minimap from './Minimap.js'

let canvas, ctx, raycaster, player, map, keyborad, renderEngine, factory, factory2, eventhandler, clock, minmap;

addEventListener('DOMContentLoaded', function () {
    let mip = document.getElementById('minimap')
    canvas = document.getElementById('canvas')

    ctx = canvas.getContext('2d')
    canvas.width = 900;
    clock = new Clock();
    canvas.height = 500;
    renderEngine = new RenderEngine(canvas)
    raycaster = new Raycaster(60, 1, 900, 500, renderEngine);
    map = new Map();


    player = new Player(3, 4, 2, 90);
    keyborad = new Keyboard(player);
    eventhandler = new EventHandler(player, raycaster.fov)
    keyborad.bindKeysInGame();
    Promise.all([
        loadImage('/textures/walls.png'),
        loadImage('/textures/objects.png'),
        loadJSON('/Levels/1-1.JSON'),
        loadJSON('settings/objectSettings.JSON'),
        loadJSON('settings/specialTilesSettings.JSON')

    ]).then(
        function ([walls, objects, level, settingsOBJ, settingsTiles]) {
            renderEngine.loadTextures(walls, objects)
            map.loadMap(level.map)
            raycaster.setMapSize(map.getMapSize().x, map.getMapSize().y)
            factory = new ObjectFactory(settingsOBJ.settingsWalkable)
            factory2 = new SpecialTilesFactory(settingsTiles, eventhandler);
            factory2.setLevel(level.specialTiles)
            factory2.createTilesAndEvents(map)
            factory.setLevel(level.objects);
            factory.createObjects(map)
            minmap = new Minimap(mip, player, map)
            player.minimap = minmap;
            render();
        }
    )


})


function render() {
    let deltaTime = clock.getDeltaTime();
    eventhandler.update(deltaTime);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    keyborad.update()
    minmap.update();
    ctx.fillStyle = '#383838'
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
    ctx.fillStyle = '#707070'
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height)
    player.move(map, deltaTime);
    raycaster.performRayCast(player.getInfoForRayCast(), map.getMap(), map.getObjects(), map.getSpecialTiles());
    renderEngine.render()
    requestAnimationFrame(render)
}

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
import EnityFactory from "./EntityFactory.js";
import EntityHandler from "./EntityHandler.js";
import EntityAnimationsBank from "./EntityAnimationsBank.js";
import HUD from "./HUD.js";
import WeaponFactory from "./WeaponFactory.js";


let canvas, ctx, raycaster, player, map, keyborad, renderEngine, factory, factory2, eventhandler, clock, minmap, hud,
    factoryW, factory3, handler, bank;
let lives = 3
let play = false;
let min = false;


function loadGame() {

    let mip = document.getElementById('minimap')


    clock = new Clock();
    map = new Map();
    player = new Player(30, 51.5, 8, 180, lives);
    handler = new EntityHandler(player, map);
    renderEngine = new RenderEngine(canvas, handler)
    raycaster = new Raycaster(60, 1, 900, 500, renderEngine);


    keyborad = new Keyboard(player);
    eventhandler = new EventHandler(player, raycaster.fov)
    keyborad.bindKeysInGame();
    Promise.all([
        loadImage('/textures/walls.png'),
        loadImage('/textures/objects.png'),
        loadImage('/textures/HUD.png'),
        loadImage('/textures/BJ.png'),
        loadImage('/textures/weapons.png'),
        loadJSON('/levels/lvl.json'),
        loadJSON('/settings/objectSettings.json'),
        loadJSON('/settings/specialTilesSettings.JSON'),
        loadJSON('/settings/entities.json'),
        loadJSON('/settings/HUDSettings.JSON'),
        loadJSON('/settings/weapons.JSON')

    ]).then(
        function ([walls, objects, hudIMG, BJ, weaponsimg, level, settingsOBJ, settingsTiles, settingsEntity, hudSett, wsettings]) {
            bank = new EntityAnimationsBank(settingsEntity)
            factory = new ObjectFactory(settingsOBJ, player, map)
            factory3 = new EnityFactory(settingsEntity, handler, factory)
            factory3.setLevel(level.entities)
            factory3.createUnits()

            map.loadMap(level.map)
            raycaster.setMapSize(map.getMapSize().x, map.getMapSize().y)

            factory2 = new SpecialTilesFactory(settingsTiles, eventhandler, handler, player);
            factory2.setLevel(level.specialTiles)
            factory2.createTilesAndEvents(map)
            factory.setLevel(level.objects);
            factory.createObjects(map)
            minmap = new Minimap(mip, player, map)
            player.minimap = minmap;
            handler.initPathFinder()
            factoryW = new WeaponFactory(wsettings, player)
            handler.minimap = minmap;
            let promiseArr = [];

            for (name of bank.getTextureNamesToLoad())
                promiseArr.push(loadImage('/textures/' + name + '.png'))


            Promise.all(promiseArr).then(function (textures) {
                let names = bank.getTextureNamesToLoad()
                for (let i = 0; i < names.length; i++) {
                    bank.newAnimation(names[i], textures[i])

                }
                hud = new HUD(hudIMG, BJ, weaponsimg, hudSett, player)
                renderEngine.loadTextures(walls, objects, bank)
                renderEngine.setHUD(hud)
                play = true;
                render();
            })

        }
    )

}

addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('canvas')

    ctx = canvas.getContext('2d')
    canvas.width = 900;

    canvas.height = 599;

    let img = new Image();
    img.src = '/textures/BJ.png'
    img.onload = function () {
        ctx.drawImage(img, 0, 265, 464, 200, 0, 0, 1400, 600)
        setTimeout(loadGame, 2000)
    }


})


function render() {
    if (player.end == true) {
        ctx.fillStyle = '#1f9670';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "60px Arial";


        ctx.fillStyle = "white";
        ctx.fillText("Koniec Dema", canvas.width / 2 - 210, canvas.height / 2 - 20);
    }
    else if (lives > 0) {
        let deltaTime = clock.getDeltaTime();
        if (renderEngine.dead && renderEngine.dead.update(deltaTime) == 1) {
            lives--;
            play = false;
            loadGame();


        }
        if (play) {

            eventhandler.update(deltaTime);
            hud.update(deltaTime)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            keyborad.update()
            if (min)
                minmap.update();
            ctx.fillStyle = '#383838'
            ctx.fillRect(0, 0, canvas.width, 250)
            ctx.fillStyle = '#707070'
            ctx.fillRect(0, 250, canvas.width, canvas.height)
            handler.update(deltaTime)

            player.update(deltaTime, map, handler);
            raycaster.performRayCast(player.getInfoForRayCast(), map.getMap(), map.getObjects(), map.getSpecialTiles(), handler.getEntites());

            renderEngine.render()
            requestAnimationFrame(render)
        }
    }
    else {
        ctx.fillStyle = "#e20606";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "60px Arial";


        ctx.fillStyle = "white";
        ctx.fillText("Game  Over", canvas.width / 2 - 210, canvas.height / 2 - 20);
    }
}

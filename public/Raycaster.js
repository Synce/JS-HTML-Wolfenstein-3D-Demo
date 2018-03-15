import {clampAngle} from "./Utilities.js";


export default class Raycaster {
    constructor(fov, stripWidth, canvasWidth, canvasHeight, renderEngine) {

        this.mapWidth = 0;
        this.mapHeight = 0;

        this.renderEngine = renderEngine;

        this.screenWidth = canvasWidth;
        this.screenHeight = canvasHeight;

        this.stripWidth = stripWidth;
        this.fov = Math.radians(fov);

        //ilość promieni "wystrzeliwanych przez emiter"
        this.numRays = Math.ceil(this.screenWidth / this.stripWidth);

        this.viewDist = (this.screenWidth / 2) / Math.tan((this.fov / 2));
    }


    setMapSize(width, height) {
        this.mapWidth = width;
        this.mapHeight = height;
    }


    performRayCast(player, map) {

        let that = this;
        for (let i = 0; i < this.numRays; i++) {
            // pozycja stripa na ekranie
            let rayScreenPos = (-this.numRays / 2 + i) * this.stripWidth;

            // dystans od gracza do środka ekranu
            let rayViewDist = Math.sqrt(rayScreenPos * rayScreenPos + this.viewDist * this.viewDist);

            // kąt promienia relatywny do pozycji gracza
            let rayAngle = Math.asin(rayScreenPos / rayViewDist);

            castSingleRay(player.rot + rayAngle, i);
        }


        function castSingleRay(rayAngle, stripIdx) {


            rayAngle = clampAngle(rayAngle)

            // Sprawdzanie w ktorą stronę porusza się promień za pomocą ćwiartek układu współrzędnych
            let right = (rayAngle > Math.PI * 2 * 0.75 || rayAngle < Math.PI * 2 * 0.25);
            let up = (rayAngle < 0 || rayAngle > Math.PI);

            //ID uderzonej ściany
            let textureID = 0;


            let dist = 0;	// dystans do ściany
            let textureX;	// część tekstury która będzie renderowana


            let isDark = false;

            // Sprawdzanie pionowych zderzeń (vertical)

            let angleTan = Math.tan(rayAngle);
            let dXVer = right ? 1 : -1; 	// przesówa się o blok w lewo/prawp
            let dYVer = dXVer * angleTan; 	// odległość poruszania się w górę i dół

            let x = right ? Math.ceil(player.x) : Math.floor(player.x);	//startowa pozycja x
            let y = player.y + (x - player.x) * angleTan;			// startowa pozycja y, poprawiona o przesunięcie z linijki wyżej

            while (x >= 0 && x < that.mapWidth && y >= 0 && y < that.mapHeight) {  //dopoki x i y mieszczą sie w granicach mapy
                let wallX = Math.floor(x + (right ? 0 : -1));
                let wallY = Math.floor(y);


                if (map[wallY][wallX] > 0) { //sprawdzanie czy punkt jest ścianą
                    let distX = x - player.x;
                    let distY = y - player.y;
                    dist = distX * distX + distY * distY;	// dystans do ściany do kwadratu (Pitagoras)

                    textureID = map[wallY][wallX]; // przypisanie ID trafionej ściany
                    textureX = y % 1;	//miejsce trafionego punktu w przedziale od (0-1)
                    if (!right) textureX = 1 - textureX; // jeżeli patrzymy w lewo tekstura musi byc odwrócona


                    break; //znalazł ściane wiec dalej nie musi szulać
                }
                x += dXVer;
                y += dYVer;
            }


            //Sprawdzanie poziomych zderzeń i sprawdzanie ktore jest bliżej

            let angleCtg = 1 / angleTan;
            let dYHor = up ? -1 : 1;
            let dXHor = dYHor * angleCtg;
            y = up ? Math.floor(player.y) : Math.ceil(player.y);
            x = player.x + (y - player.y) * angleCtg;

            while (x >= 0 && x < that.mapWidth && y >= 0 && y < that.mapHeight) {
                let wallY = Math.floor(y + (up ? -1 : 0));
                let wallX = Math.floor(x);
                if (map[wallY][wallX] > 0) {
                    let distX = x - player.x;
                    let distY = y - player.y;
                    let blockDist = distX * distX + distY * distY;

                    //sprawdzanie ktory dystans jest krótszy

                    if (!dist || blockDist < dist) {
                        dist = blockDist;
                        isDark = true;
                        textureID = map[wallY][wallX];
                        textureX = x % 1;
                        if (up) textureX = 1 - textureX;
                    }
                    break;
                }
                x += dXHor;
                y += dYHor;
            }

            if (dist) {

                dist = Math.sqrt(dist);

                //pozbycie sie efektu rybiego oka
                dist = dist * Math.cos(player.rot - rayAngle);

                let height = that.viewDist / dist;

                let y = (that.screenHeight - height) / 2;
                let x = stripIdx * that.stripWidth

                textureX *= 63;// tekstruy maja po 64 pikesele


                that.renderEngine.drawStrip(textureID, textureX, x, y, that.stripWidth, height, isDark)

            }

        }


    }
}
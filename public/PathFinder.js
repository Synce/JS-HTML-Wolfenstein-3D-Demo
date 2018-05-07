import PathNode from "./PathNode.js";
import Heap from "./Heap.js";
import RayCaster from "./Raycaster.js"
import {RectCirCollision, RectCirDist} from "./Utilities.js";

export default class PathFinder {
    constructor(map) {
        this.map = map;
        this.grid = [];

    }

    findWay(s, meta, diagonal = false) {
        let that = this;

        let final = [];
        let open = new Heap(function (x) {
            return x.getFCost();

        })
        let closed = [];
        let start = this.grid[Math.floor(s.y)][Math.floor(s.x)];
        let target = this.grid[Math.floor(meta.y)][Math.floor(meta.x)];
        open.push(start);


        while (open.length() > 0) {
            let currentNode = open.content[0];
            open.remove(currentNode)
            closed.push(currentNode)

            if (currentNode == target) {

                translatePath(start, target)

                final = smoothPath(final, s)

                return final
            }

            for (let node of this.getNeighbours(currentNode)) {

                if (!diagonal || ((node.x != Math.floor(currentNode.x) && node.y != Math.floor(currentNode.y)) || node == target))
                    if ((node.walkable && !closed.includes(node)) || node == target) {

                        let newMovementCost = currentNode.gCost + getDistance(currentNode, node);
                        if (newMovementCost < node.gCost || !open.includes(node)) {
                            node.gCost = newMovementCost;
                            node.hCost = getDistance(node, target)
                            node.parent = currentNode;

                            if (!open.includes(node))
                                open.push(node)
                            else {
                                open.goUp(open.content.indexOf(node));
                            }


                        }
                    }
            }
        }
        return [];


        function getDistance(nodeA, nodeB) {
            let dstX = Math.abs(nodeA.x - nodeB.x)
            let dstY = Math.abs(nodeA.y - nodeB.y)
            if (dstX > dstY)
                return 1.4 * dstY + (dstX - dstY)
            return 1.4 * dstX + (dstY - dstX)
        }

        function smoothPath(path, s) {


            let start = s
            let final = [];
            let lastSeen = s;
            let i = 0;

            if (path.length > 1) {
                for (let node of path) {

                    i++
                    if (i !== 1 && diagonal || (!node.doors && RayCaster.castRay(start, {
                            x: node.x + .5,
                            y: node.y + .5
                        }, that.map))) {
                        final.push({x: lastSeen.x + .5, y: lastSeen.y + .5, doors: lastSeen.doors})
                        start = {x: lastSeen.x + .5, y: lastSeen.y + .5}
                        lastSeen = node;


                    }
                    else {
                        lastSeen = node;

                    }
                }
                final.push({x: lastSeen.x + .5, y: lastSeen.y + .5, doors: lastSeen.doors})


            }
            else {
                final.push({x: lastSeen.x, y: lastSeen.y, doors: lastSeen.doors})
            }

            return final;
        }

        function translatePath(start, end) {
            let currentNode = end;
            while (currentNode != start) {
                final.unshift(currentNode);
                currentNode = currentNode.parent;
            }

        }

    }

    createPathLayer() {

        for (let y = 0; y < this.map.getMapSize().y; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.map.getMapSize().x; x++) {
                let collision = this.map.checkForCollisions(y, x)
                if (collision && this.map.checkForDoors(y, x))
                    this.grid[y][x] = new PathNode(true, x, y, true);

                else
                    this.grid[y][x] = new PathNode(!collision, x, y);

            }
        }
    }

    getNeighbours(node) {

        let tab = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x != 0 || y != 0) {


                    let checkX = node.x + x;
                    let checkY = node.y + y;
                    if (checkX >= 0 && this.map.getMapSize().x && checkY >= 0 && this.map.getMapSize().y)
                        tab.push(this.grid[checkY][checkX])

                }
            }
        }

        return tab
    }

    static checkCollisions(goX, goY, r, map, minimap) {
        let toX = -1;
        let toY = -1;
        let x = Math.floor(goX)
        let y = Math.floor(goY)
        if (y > 0 && y < map.getMapSize().y && x > 0 && x < map.getMapSize().x) {

            function checkBlock(checkY, checkX, y, x, r = 0.4) {
                if (map.checkForCollisions(checkY, checkX) && RectCirCollision(checkX, checkY, x, y, r))
                    return true;
                return false;
            }

            toY = goY;
            toX = goX;


            for (let i = -1; i <= 1; i++) {
                if (checkBlock(y, x + i, goY, goX, r)) {
                    toX = i > 0 ? x + 1 - r : x + r
                    if (minimap)
                        minimap.addActiveBlock(x + i, y, 'rgba(33, 23, 181,0.5)')

                } else {
                    if (minimap)
                        minimap.addActiveBlock(x + i, y, 'rgba(23, 181, 47,0.5)')
                }
                if (checkBlock(y + i, x, goY, goX, r)) {
                    toY = i > 0 ? y + 1 - r : y + r
                    if (minimap)
                        minimap.addActiveBlock(x, y + i, 'rgba(33, 23, 181,0.5)')
                }
                else {
                    if (minimap)
                        minimap.addActiveBlock(x, y + i, 'rgba(23, 181, 47,0.5)')
                }
            }

            for (let checkX = -1; checkX <= 1; checkX++)
                for (let checkY = -1; checkY <= 1; checkY++)

                    if (checkX !== 0 && checkY !== 0) {
                        let dist = RectCirDist(x + checkX, y + checkY, toX, toY)
                        if (checkBlock(y + checkY, x + checkX, toY, toX, r) && (!map.checkForCollisions(y, x + checkX) || map.checkForCollisions(y + checkY, x))) {

                            if (Math.abs(dist.x) < Math.abs(dist.y)) {
                                let d = Math.sqrt(((r * r) - (dist.x * dist.x)));
                                d = dist.y < 0 ? -d : d;
                                d = dist.y < 0 ? Math.abs(dist.y) + d : d - dist.y;
                                toY += d
                            }
                            else {
                                let d = Math.sqrt(((r * r) - (dist.y * dist.y)));
                                d = dist.x < 0 ? -d : d;
                                d = dist.x < 0 ? Math.abs(dist.x) + d : d - dist.x;
                                toX += d
                            }

                            if (minimap)
                                minimap.addActiveBlock(x + checkX, y + checkY, 'rgba(33, 23, 181,0.5)')
                        }
                        else {
                            if (minimap)
                                minimap.addActiveBlock(x + checkX, y + checkY, 'rgba(23, 181, 47,0.5)')
                        }
                    }

        }
        return {x: toX, y: toY}
    }


}
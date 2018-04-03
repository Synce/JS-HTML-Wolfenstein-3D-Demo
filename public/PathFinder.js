import PathNode from "./PathNode.js";
import Heap from "./Heap.js";

export default class PathFinder {
    constructor() {

    }

    findWay(meta, justCheck = false) {
        let final = [];
        let open = new Heap(function (x) {
            return x.getFCost();

        })
        let closed = [];
        let start = GameManager.pathFinding.grid[this.position.x][this.position.y]
        let target = GameManager.pathFinding.grid[meta[0]][meta[1]];
        open.push(start);


        while (open.size() > 0) {
            let currentNode = open.content[0];
            open.remove(currentNode)
            closed.push(currentNode)

            if (currentNode === target) {
                if (justCheck)
                    return true
                translatePath(start, target)
                smoothingPath();
                return final
            }
            for (let node of GameManager.pathFinding.getNeighbours(currentNode)) {
                if (node.walkable && !closed.includes(node) || node == target) {

                    let newMovementCost = currentNode.gCost + getDistance(currentNode, node);
                    if (newMovementCost < node.gCost || !open.includes(node)) {
                        node.gCost = newMovementCost;
                        node.hCost = getDistance(node, target)
                        node.parent = currentNode;

                        if (!open.includes(node))
                            open.push(node)
                        else {
                            open.bubbleUp(open.content.indexOf(node));
                        }


                    }
                }
            }
        }
        return false;


        function smoothingPath() {
            let segments = [];
            let segment = {
                start: null,
                meta: null,
            }
            let newSeg = true;
            let direction = null;
            for (let i = 0; i < final.length - 1; i++) {
                console.log(direction)
                if (newSeg) {
                    segment.start = final[i];
                    if (final[i].x === final[i + 1].x)
                        direction = 'x';
                    else if (final[i].y === final[i + 1].y)
                        direction = 'y';
                    else
                        direction = 'xy'
                    newSeg = false;

                }
                if (direction === 'x') {
                    if (final[i].x !== final[i + 1].x || i === final.length - 2) {
                        newSeg = true;
                        segment.meta = final[i]
                        segments.push(segment)
                    }
                }
                else if (direction === 'y') {
                    if (final[i].y !== final[i + 1].y || i === final.length - 2) {
                        newSeg = true;
                        segment.meta = final[i]
                        segments.push(segment)
                    }
                }
                else {
                    console.log(final[i].y)
                    console.log(final[i + 1].y)
                    console.log(final[i].x)
                    console.log(final[i + 1].x)

                    if (final[i].y == final[i + 1].y || final[i].x == final[i + 1].x || i === final.length - 2) {
                        newSeg = true;
                        segment.meta = final[i]
                        segments.push(segment)
                    }
                }

            }
            final = [];
            for (let i = 0; i < segments.length; i++) {
                final.push(segments[i].start)
                final.push(segments[i].meta)
            }
        }

        function getDistance(nodeA, nodeB) {
            let dstX = Math.abs(nodeA.x - nodeB.x)
            let dstY = Math.abs(nodeA.y - nodeB.y)
            if (dstX > dstY)
                return 28 * dstY + 20 * (dstX - dstY)
            return 28 * dstX + 20 * (dstY - dstX)
        }

        function translatePath(start, end) {
            let currentNode = end;
            while (currentNode != start) {
                final.unshift(currentNode);
                currentNode = currentNode.parent;
            }
            final.unshift(start);
        }

    }

    createPathLayer() {
        this.grid = [];
        for (let i = 0; i < 100; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 100; j++) {

                this.grid[i][j] = new PathNode(GameManager.World.map[i][j].walkable, i, j,);

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
                    if (checkX >= 0 && checkX < 100 && checkY >= 0 && checkY < 100)
                        tab.push(this.grid[checkX][checkY])
                }
            }
        }

        return tab
    }

}
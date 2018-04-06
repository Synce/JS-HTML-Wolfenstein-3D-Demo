export default class Heap {
    constructor(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;

    }

    push(e) {
        this.content.push(e);
        this.goUp(this.content.length - 1);
    }

    pop() {
        let result = this.content[0];

        let end = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.goDown(0);
        }
        return result;
    }

    remove(node) {

        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i] !== node) continue;
            let end = this.content.pop();
            if (i === this.content.length - 1) break;
            this.content[i] = end;
            this.goUp(i);
            this.goDown(i);
            break;
        }
    }

    length() {
        return this.content.length;
    }

    goUp(n) {
        let element = this.content[n];
        let score = this.scoreFunction(element);

        while (n > 0) {

            let parentN = Math.floor((n + 1) / 2) - 1;
            let parent = this.content[parentN];
            if (score >= this.scoreFunction(parent))
                break;

            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    }

    goDown(n) {
        let length = this.content.length
        let element = this.content[n]
        let elemScore = this.scoreFunction(element)

        while (true) {
            let child2Number = (n + 1) * 2
            let child1Number = child2Number - 1;


            let bufor = null;
            if (child1Number < length) {

                let child1 = this.content[child1Number];
                let child1Score = this.scoreFunction(child1);

                if (child1Score < elemScore)
                    bufor = child1Number;
            }

            if (child2Number < length) {
                let child2 = this.content[child2Number],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (bufor == null ? elemScore : this.scoreFunction(this.content[bufor])))
                    bufor = child2Number;
            }

            if (bufor == null) break;

            this.content[n] = this.content[bufor];
            this.content[bufor] = element;
            n = bufor;
        }
    }

    includes(node) {
        return this.content.includes(node)
    }

    getScore() {
        return this.scoreFunction(this.content[0]);
    }
};
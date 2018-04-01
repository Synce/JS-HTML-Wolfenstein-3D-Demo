export default class TimeHelper {
    constructor(time, number) {
        this.time = time;
        this.number = number;
        this.perSecond = number / time
        this.actualNumber = 0;
    }

    update(time) {

        this.actualNumber += time * this.perSecond;
        if (this.actualNumber > this.number)
            this.actualNumber = this.number;


        return this.actualNumber;

    }

    reset() {
        this.actualNumber = 0;
    }

    fix(number) {
        this.actualNumber = number
    }
}
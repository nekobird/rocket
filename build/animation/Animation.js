import { Num, } from '../Rocket';
export class Animation {
    constructor(config) {
        this.isActive = false;
        this.isAnimating = false;
        this.isPaused = false;
        this.isReversed = false;
        this.alternate = false;
        this.delay = 0;
        this.duration = 2;
        this.iterationCount = 0;
        this.iterationDelay = 0;
        this.numberOfIterations = 1;
        this.exports = 0;
        this.timingFunction = t => {
            return t;
        };
        this.onStart = () => { };
        this.onComplete = () => { };
        this.onIterationStart = () => { };
        this.onIterationComplete = () => { };
        this.callback = () => { };
        this.onTick = (n, fn, data) => { };
        this.direction = true;
        this.config = config;
        return this;
    }
    set config(config) {
        Object.assign(this, config);
    }
    goToBeginning() {
        if (typeof this.onTick === 'function') {
            this.onTick(0, this, undefined);
        }
        else if (this.onTick.constructor === Array) {
            for (let onTick of this.onTick) {
                onTick(0, this, undefined);
            }
        }
        return this;
    }
    goToEnd() {
        if (typeof this.onTick === 'function') {
            this.onTick(1, this, undefined);
        }
        else if (this.onTick.constructor === Array) {
            for (let onTick of this.onTick) {
                onTick(1, this, undefined);
            }
        }
        return this;
    }
    reset() {
        this.clearSessions();
        this.isActive = false;
        this.isAnimating = false;
        this.isPaused = false;
        this.direction = true;
        this.iterationCount = 0;
        this.startTime = 0;
        this.pauseTime = 0;
        this.endTime = 0;
        this.progress = 0;
        return this;
    }
    pause() {
        if (this.isActive === true &&
            this.isAnimating == true &&
            this.isPaused === false) {
            this.clearSessions();
            this.isAnimating = false;
            this.isPaused = true;
            this.pauseTime = Date.now();
        }
        return this;
    }
    stop() {
        this.reset();
        this.callOnComplete();
        this.callback();
        return this;
    }
    stopAndJumptToEnd() {
        this
            .reset()
            .goToEnd()
            .callOnComplete()
            .callback();
        return this;
    }
    stopAndJumpToBeginning() {
        this
            .reset()
            .goToBeginning()
            .callOnComplete()
            .callback();
        return this;
    }
    play(delay) {
        this.callOnStart();
        this.isActive = true;
        if (typeof delay !== 'number') {
            delay = this.delay;
        }
        this.timeoutID = setTimeout(this.start.bind(this), delay * 1000);
        return this;
    }
    start() {
        this.isActive = true;
        if (this.isReversed === true) {
            this.direction = false;
        }
        if (this.isPaused === true) {
            let startTimeDelta = this.pauseTime - this.startTime;
            let endTimeDelta = this.endTime - this.pauseTime;
            let now = Date.now();
            this.startTime = now - startTimeDelta;
            this.endTime = now + endTimeDelta;
            this.isPaused = false;
        }
        else {
            this.startTime = Date.now();
            this.endTime = this.startTime + (this.duration * 1000);
        }
        this.isAnimating = true;
        this.callOnIterationStart();
        this.loop();
        return this;
    }
    loop() {
        let frame = () => {
            this.tick();
            if (this.isActive === true &&
                this.isAnimating === true &&
                this.isPaused === false) {
                if (this.progress < 1) {
                    this.loop();
                    return;
                }
                else {
                    this.iterationCount++;
                    this.callOnIterationComplete();
                    if (typeof this.numberOfIterations === 'number' &&
                        this.iterationCount >= this.numberOfIterations) {
                        this.stop();
                        return;
                    }
                    if (this.alternate === true) {
                        this.toggleDirection();
                    }
                    this.play(this.iterationDelay);
                }
            }
        };
        this.RAFID = window.requestAnimationFrame(frame);
        return this;
    }
    tick() {
        this.progress = this.currentNValue;
        let n = this.timingFunction(this.progress);
        if (this.direction === false) {
            n = 1 - n;
        }
        if (typeof this.onTick === 'function') {
            this.onTick(n, this.iterationCount, this.exports);
        }
        else if (this.onTick.constructor === Array) {
            for (let onTick of this.onTick) {
                onTick(n, this.iterationCount, this.exports);
            }
        }
        return this;
    }
    get currentNValue() {
        return Num.modulate(Date.now(), [this.startTime, this.endTime], 1, true);
    }
    clearSessions() {
        clearTimeout(this.timeoutID);
        window.cancelAnimationFrame(this.RAFID);
        return this;
    }
    toggleDirection() {
        this.direction = !this.direction;
        return this;
    }
    callOnStart() {
        if (typeof this.onStart === 'function') {
            this.onStart(this);
        }
        else if (this.onStart.constructor === Array) {
            for (let callback of this.onStart) {
                callback(this);
            }
        }
        return this;
    }
    callOnComplete() {
        if (typeof this.onComplete === 'function') {
            this.onComplete(this);
        }
        else if (this.onComplete.constructor === Array) {
            for (let callback of this.onComplete) {
                callback(this);
            }
        }
        return this;
    }
    callOnIterationStart() {
        if (typeof this.onIterationStart === 'function') {
            this.onIterationStart(this);
        }
        else if (this.onIterationStart.constructor === Array) {
            for (let callback of this.onIterationStart) {
                callback(this);
            }
        }
        return this;
    }
    callOnIterationComplete() {
        if (typeof this.onIterationComplete === 'function') {
            this.onIterationComplete(this);
        }
        else if (this.onIterationComplete.constructor === Array) {
            for (let callback of this.onIterationComplete) {
                callback(this);
            }
        }
        return this;
    }
}
//# sourceMappingURL=Animation.js.map
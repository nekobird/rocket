export class KeyboardEventHandler {
    constructor() {
        this.name;
        this.manager;
        this.lastFiredEvent;
        this.lastKeyCode;
        this.isDown = false;
        this.keyDownStartTime;
        this.keyDownEndTime;
        this.keyDownDuration;
        this.keyPressTime;
        this.determineKeyDown = () => {
            return true;
        };
        this.determineKeyPress = () => {
            return true;
        };
        this.onKeyDownStart = () => { };
        this.onKeyDownEnd = () => { };
        this.onKeyPress = () => { };
    }
    handleKeyDown(event) {
        if (this.determineKeyDown(event.keyCode, event, this) === true) {
            this.keyDownStartTime = Date.now();
            this.lastFiredEvent = event;
            this.lastKeyCode = event.keyCode;
            this.isDown = true;
            if (typeof this.onKeyDownStart === 'function') {
                this.onKeyDownStart(event.keyCode, event, this);
            }
            else if (this.onKeyDownStart.constructor === Array) {
                this.onKeyDownStart.forEach(callback => {
                    callback(event.keyCode, event, this);
                });
            }
        }
    }
    handleKeyPress(event) {
        if (this.determineKeyPress(event.keyCode, event, this) === true) {
            this.keyPressTime = Date.now();
            this.lastFiredEvent = event;
            this.lastKeyCode = event.keyCode;
            if (typeof this.onKeyPress === 'function') {
                this.onKeyPress(event.keyCode, event, this);
            }
            else if (this.onKeyPress.constructor === Array) {
                this.onKeyPress.forEach(callback => {
                    callback(event.keyCode, event, this);
                });
            }
        }
    }
    handleKeyUp(event) {
        if (this.isDown === true) {
            this.keyDownEndTime = Date.now();
            this.keyDownDuration = this.keyDownEndTime - this.keyDownStartTime;
            this.lastFiredEvent = event;
            this.lastKeyCode = event.keyCode;
            this.isDown = false;
            if (typeof this.onKeyDownEnd === 'function') {
                this.onKeyDownEnd(event.keyCode, event, this);
            }
            else if (this.onKeyDownEnd.constructor === Array) {
                this.onKeyDownEnd.forEach(callback => {
                    callback(event.keyCode, event, this);
                });
            }
        }
    }
}
//# sourceMappingURL=KeyboardEventHandler.js.map
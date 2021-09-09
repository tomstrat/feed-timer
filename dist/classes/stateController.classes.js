var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class StateController {
    constructor(button, time, start) {
        this._buttonState = button;
        this._time = time;
        this._startTime = start;
        this.wakeLock = null;
    }
    clearState() {
        this.time = 0;
        this.startTime = "";
        this.buttonState = "stop";
    }
    lockScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.wakeLock = yield navigator.wakeLock.request('screen');
            }
            catch (err) {
                // The Wake Lock request has failed - usually system related, such as battery.
                console.log(`${err.name}, ${err.message}`);
            }
        });
    }
    releaseLock() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.wakeLock.release();
                this.wakeLock = null;
            }
            catch (err) {
                // The Wake Lock request has failed - usually system related, such as battery.
                console.log(`${err.name}, ${err.message}`);
            }
        });
    }
    //GETTERS
    get buttonState() {
        return this._buttonState;
    }
    get time() {
        return this._time;
    }
    get startTime() {
        return this._startTime;
    }
    //SETTERS
    set buttonState(state) {
        this._buttonState = state;
    }
    set time(state) {
        this._time = state;
    }
    set startTime(state) {
        this._startTime = state;
    }
}

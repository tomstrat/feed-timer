var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ExcelController } from "./classes/excelController.classes.js";
import { StateController } from "./classes/stateController.classes.js";
import { DOMController } from "./classes/domController.classes.js";
import { Utils } from "./classes/utils.classes.js";
class FeedController {
    constructor() {
        this.stateController = new StateController("start", 0, "");
        this.domController = new DOMController(this.stateController, this.startTimer.bind(this), this.stopTimer.bind(this), this.resetTimer.bind(this), this.submitData.bind(this));
        this.excelController = new ExcelController();
        this.utils = new Utils();
        this.domController.hideConfirm();
        const timestore = window.localStorage.getItem("duration");
        this.domController.timer = timestore || "00:00";
        if (timestore) {
            const timesplit = timestore.split(":");
            this.stateController.time = (parseInt(timesplit[0]) * 60) + parseInt(timesplit[1]);
        }
    }
    swap() {
        if (this.stateController.buttonState === "start") {
            this.stateController.buttonState = "stop";
            this.domController.swapTo("stop");
        }
        else {
            this.stateController.buttonState = "start";
            this.domController.swapTo("start");
        }
    }
    startTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stateController.startTime === "") {
                this.stateController.startTime = this.utils.getTime();
            }
            this.stateController.lockScreen();
            this.swap();
            this.interval = window.setInterval(() => {
                this.stateController.time += 1;
                let mins = Math.floor(this.stateController.time / 60);
                let seconds = Math.floor(this.stateController.time % 60);
                if (mins < 10) {
                    mins = `0${mins}`;
                }
                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }
                this.domController.timer = `${mins}:${seconds}`;
                window.localStorage.setItem("duration", `${mins}:${seconds}`);
            }, 1000);
        });
    }
    stopTimer() {
        this.swap();
        clearInterval(this.interval);
    }
    resetTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.domController.hideConfirm();
            this.stopTimer();
            this.stateController.clearState();
            this.domController.clearDOM();
            window.localStorage.clear();
            this.stateController.releaseLock();
        });
    }
    gatherData() {
        if (this.domController.volume === "") {
            this.domController.volume = "0";
        }
        if (this.stateController.startTime === "") {
            this.stateController.startTime = this.utils.getTime();
        }
        return {
            date: this.utils.getDate(),
            time: this.stateController.startTime,
            duration: Math.floor(this.stateController.time / 60),
            volume: parseInt(this.domController.volume),
            wee: this.domController.wee,
            poo: this.domController.poo
        };
    }
    submitData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.domController.hideConfirm();
            this.stateController.releaseLock();
            window.localStorage.clear();
            console.log(this.gatherData());
            this.excelController.submitData(this.gatherData());
            this.resetTimer();
        });
    }
}
const myFeedTimer = new FeedController();

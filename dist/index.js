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
class FeedController {
    constructor() {
        this.setup();
        this.addEvents();
    }
    setup() {
        this.start = document.querySelector(".start");
        this.start.style.display = "block";
        this.stop = document.querySelector(".stop");
        this.stop.style.display = "none";
        this.timer = document.querySelector(".timer");
        this.volume = document.querySelector(".volume input");
        this.wee = document.querySelector(".wee");
        this.poo = document.querySelector(".poo");
        this.reset = document.querySelector(".reset");
        this.confirm = document.querySelector(".confirm");
        this.hideConfirm();
        this.yes = document.querySelector(".yes");
        this.no = document.querySelector(".no");
        this.confirmOrigin = document.querySelector(".origin");
        this.submit = document.querySelector(".submit");
        this.time = 0;
        this.startTime = "";
        this.buttonState = "start";
        this.excelController = new ExcelController();
        this.wakeLock = null;
    }
    addEvents() {
        this.start.addEventListener("click", this.startTimer.bind(this));
        this.stop.addEventListener("click", this.stopTimer.bind(this));
        this.reset.addEventListener("click", this.showConfirm.bind(this));
        this.reset.addEventListener("click", () => {
            this.confirmOrigin.dataset.origin = "reset";
        });
        this.yes.addEventListener("click", this.redirectConfirm.bind(this));
        this.no.addEventListener("click", this.hideConfirm.bind(this));
        this.submit.addEventListener("click", this.showConfirm.bind(this));
        this.submit.addEventListener("click", () => {
            this.confirmOrigin.dataset.origin = "submit";
        });
    }
    swap() {
        if (this.buttonState === "start") {
            this.buttonState = "stop";
            this.start.style.display = "none";
            this.stop.style.display = "block";
        }
        else {
            this.buttonState = "start";
            this.start.style.display = "block";
            this.stop.style.display = "none";
        }
    }
    getTime() {
        let date = new Date();
        let mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        return `${date.getHours()}:${mins}`;
    }
    getDate() {
        let date = new Date();
        const dateString = date.toLocaleDateString("en-GB", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
        });
        return dateString;
    }
    startTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.startTime === "") {
                this.startTime = this.getTime();
            }
            try {
                this.wakeLock = yield navigator.wakeLock.request('screen');
            }
            catch (err) {
                // The Wake Lock request has failed - usually system related, such as battery.
                console.log(`${err.name}, ${err.message}`);
            }
            this.swap();
            this.interval = setInterval(() => {
                this.time += 1;
                let mins = Math.floor(this.time / 60);
                let seconds = Math.floor(this.time % 60);
                if (mins < 10) {
                    mins = `0${mins}`;
                }
                if (seconds < 10) {
                    seconds = `0${seconds}`;
                }
                this.timer.innerHTML = `${mins}:${seconds}`;
            }, 1000);
        });
    }
    stopTimer() {
        this.swap();
        clearInterval(this.interval);
    }
    showConfirm() {
        this.confirm.style.display = "flex";
    }
    hideConfirm() {
        this.confirm.style.display = "none";
    }
    redirectConfirm() {
        if (this.confirmOrigin.dataset.origin === "reset") {
            this.resetTimer();
        }
        else {
            this.submitData();
        }
    }
    resetTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hideConfirm();
            this.buttonState = "stop";
            this.stopTimer();
            this.time = 0;
            this.startTime = "";
            this.timer.innerHTML = "00:00";
            this.volume.value = "";
            this.wee.checked = false;
            this.poo.checked = false;
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
    gatherData() {
        if (this.volume.value === "") {
            this.volume.value = "0";
        }
        if (this.startTime === "") {
            this.startTime = this.getTime();
        }
        return {
            date: this.getDate(),
            time: this.startTime,
            duration: Math.floor(this.time / 60),
            volume: parseInt(this.volume.value),
            wee: this.wee.checked,
            poo: this.poo.checked
        };
    }
    submitData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hideConfirm();
            try {
                yield this.wakeLock.release();
                this.wakeLock = null;
            }
            catch (err) {
                // The Wake Lock request has failed - usually system related, such as battery.
                console.log(`${err.name}, ${err.message}`);
            }
            console.log(this.gatherData());
            this.excelController.submitData(this.gatherData());
            this.resetTimer();
        });
    }
}
const myFeedTimer = new FeedController();

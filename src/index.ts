import { Payload } from "./interfaces/payload.interface.js"
import { ExcelController } from "./classes/excelController.classes.js";
import { StateController } from "./classes/stateController.classes.js";
import { DOMController } from "./classes/domController.classes.js";
import { Utils } from "./classes/utils.classes.js";

class FeedController {

  private interval!: number;
  private excelController: ExcelController;
  private stateController: StateController;
  private domController: DOMController;
  private utils: Utils;

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

  private swap() {
    if (this.stateController.buttonState === "start") {
      this.stateController.buttonState = "stop";
      this.domController.swapTo("stop");
    } else {
      this.stateController.buttonState = "start";
      this.domController.swapTo("start");
    }
  }

  private async startTimer() {
    if (this.stateController.startTime === "") {
      this.stateController.startTime = this.utils.getTime();
    }

    this.stateController.lockScreen();
    this.swap();

    this.interval = window.setInterval(() => {
      this.stateController.time += 1;
      let mins: number | string = Math.floor(this.stateController.time / 60);
      let seconds: number | string = Math.floor(this.stateController.time % 60);
      if (mins < 10) {
        mins = `0${mins}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      this.domController.timer = `${mins}:${seconds}`;
      window.localStorage.setItem("duration", `${mins}:${seconds}`);
    }, 1000);
  }

  private stopTimer() {
    this.swap();
    clearInterval(this.interval);
  }

  private async resetTimer() {
    this.domController.hideConfirm();
    this.stopTimer();
    this.stateController.clearState();
    this.domController.clearDOM();
    window.localStorage.clear();
    this.stateController.releaseLock();
  }

  private gatherData(): Payload {

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
    }
  }

  private async submitData() {
    this.domController.hideConfirm();
    this.stateController.releaseLock();
    window.localStorage.clear();
    console.log(this.gatherData());
    this.excelController.submitData(this.gatherData());
    this.resetTimer();
  }

}

const myFeedTimer = new FeedController();
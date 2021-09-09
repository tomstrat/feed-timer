import { Payload } from "./interfaces/payload.interface.js"
import { ExcelController } from "./classes/excelController.classes.js";

class FeedController {
  private start!: HTMLDivElement;
  private stop!: HTMLDivElement;
  private buttonState!: "start" | "stop";
  private timer!: HTMLDivElement;
  private volume!: HTMLInputElement;
  private wee!: HTMLInputElement;
  private poo!: HTMLInputElement;
  private reset!: HTMLDivElement;
  private confirm!: HTMLDivElement;
  private yes!: HTMLDivElement
  private no!: HTMLDivElement;
  private confirmOrigin!: HTMLDivElement;
  private submit!: HTMLDivElement;
  private interval!: number;
  private time!: number;
  private startTime!: string;
  private excelController!: ExcelController;
  private wakeLock!: any;


  constructor() {
    this.setup();
    this.addEvents();
  }

  private setup() {
    this.start = document.querySelector(".start") as HTMLDivElement;
    this.start.style.display = "block";
    this.stop = document.querySelector(".stop") as HTMLDivElement;
    this.stop.style.display = "none";
    this.timer = document.querySelector(".timer") as HTMLDivElement;
    this.volume = document.querySelector(".volume input") as HTMLInputElement;
    this.wee = document.querySelector(".wee") as HTMLInputElement;
    this.poo = document.querySelector(".poo") as HTMLInputElement;
    this.reset = document.querySelector(".reset") as HTMLDivElement;
    this.confirm = document.querySelector(".confirm") as HTMLDivElement;
    this.hideConfirm();
    this.yes = document.querySelector(".yes") as HTMLDivElement;
    this.no = document.querySelector(".no") as HTMLDivElement;
    this.confirmOrigin = document.querySelector(".origin") as HTMLDivElement;
    this.submit = document.querySelector(".submit") as HTMLDivElement;
    this.startTime = "";
    this.time = 0;
    this.buttonState = "start";
    this.excelController = new ExcelController();
    this.wakeLock = null;
    const timestore = window.localStorage.getItem("duration");
    this.timer.innerHTML = timestore || "00:00";
    if (timestore) {
      const timesplit = timestore.split(":");
      this.time = (parseInt(timesplit[0]) * 60) + parseInt(timesplit[1]);
    }
  }

  private addEvents() {
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

  private swap() {
    if (this.buttonState === "start") {
      this.buttonState = "stop";
      this.start.style.display = "none";
      this.stop.style.display = "block";
    } else {
      this.buttonState = "start";
      this.start.style.display = "block";
      this.stop.style.display = "none";
    }
  }

  private getTime(): string {
    let date = new Date();
    let mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${date.getHours()}:${mins}`;
  }

  private getDate(): string {
    let date = new Date();
    const dateString = date.toLocaleDateString("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit"
    })
    return dateString;
  }

  private async startTimer() {
    if (this.startTime === "") {
      this.startTime = this.getTime();
    }
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
    } catch (err: any) {
      // The Wake Lock request has failed - usually system related, such as battery.
      console.log(`${err.name}, ${err.message}`);
    }
    this.swap();
    this.interval = setInterval(() => {
      this.time += 1;
      let mins: number | string = Math.floor(this.time / 60);
      let seconds: number | string = Math.floor(this.time % 60);
      if (mins < 10) {
        mins = `0${mins}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      this.timer.innerHTML = `${mins}:${seconds}`;
      window.localStorage.setItem("duration", `${mins}:${seconds}`);
    }, 1000);
  }

  private stopTimer() {
    this.swap();
    clearInterval(this.interval);
  }

  private showConfirm() {
    this.confirm.style.display = "flex";
  }

  private hideConfirm() {
    this.confirm.style.display = "none";
  }

  private redirectConfirm() {
    if (this.confirmOrigin.dataset.origin === "reset") {
      this.resetTimer();
    } else {
      this.submitData();
    }
  }

  private async resetTimer() {
    this.hideConfirm();
    this.buttonState = "stop";
    this.stopTimer();
    this.time = 0;
    this.startTime = "";
    this.timer.innerHTML = "00:00";
    window.localStorage.clear();
    this.volume.value = "";
    this.wee.checked = false;
    this.poo.checked = false;
    try {
      await this.wakeLock.release();
      this.wakeLock = null;
    } catch (err: any) {
      // The Wake Lock request has failed - usually system related, such as battery.
      console.log(`${err.name}, ${err.message}`);
    }
  }

  private gatherData(): Payload {

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
    }
  }

  private async submitData() {
    this.hideConfirm();
    try {
      await this.wakeLock.release();
      this.wakeLock = null;
    } catch (err: any) {
      // The Wake Lock request has failed - usually system related, such as battery.
      console.log(`${err.name}, ${err.message}`);
    }
    window.localStorage.clear();
    console.log(this.gatherData());
    this.excelController.submitData(this.gatherData());
    this.resetTimer();
  }

}

const myFeedTimer = new FeedController();
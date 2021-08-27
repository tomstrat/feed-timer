const noSleep = require("nosleep.js");

interface Payload {
  date: string;
  time: string;
  duration: number;
  volume: string | null;
  wee: boolean,
  poo: boolean
}

class ExcelController {
  private url: string;

  constructor(){
    this.url = "https://script.google.com/macros/s/AKfycbx-Ncr5-J7qFwV3d_d3cw6gHhulgsCF-hhpjTyoPkC4eOxPmkIzfsGzccNqJxf8Q-Hr/exec";
  }


  public submitData(payload: Payload) {
    fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        data: payload
      })
    });
  }
}

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
  private interval!: NodeJS.Timer;
  private time!: number;
  private startTime!: string;
  private excelController!: ExcelController;
  private noSleep!: any;


  constructor(){
    this.setup();
    this.addEvents();
  }

  private setup(){
    this.start = document.querySelector(".start") as HTMLDivElement;
    this.start.style.display = "block";
    this.stop = document.querySelector(".stop")as HTMLDivElement;
    this.stop.style.display = "none";
    this.timer = document.querySelector(".timer")as HTMLDivElement;
    this.volume = document.querySelector(".volume input") as HTMLInputElement;
    this.wee = document.querySelector(".wee") as HTMLInputElement;
    this.poo = document.querySelector(".poo") as HTMLInputElement;
    this.reset = document.querySelector(".reset") as HTMLDivElement;
    this.confirm = document.querySelector(".confirm") as HTMLDivElement;
    this.hideConfirm();
    this.yes = document.querySelector(".yes") as HTMLDivElement;
    this.no = document.querySelector(".no") as HTMLDivElement;
    this.confirmOrigin = document.querySelector(".origin") as HTMLDivElement;
    this.submit = document.querySelector(".submit")as HTMLDivElement;
    this.time = 0;
    this.startTime = "";
    this.buttonState = "start";
    this.excelController = new ExcelController();
    this.noSleep = new noSleep();
  }

  private addEvents(){
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

  private swap(){
    if(this.buttonState === "start"){
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
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  private getDate(): string {
    let date = new Date();
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  private startTimer(){
    if(this.startTime === "") {
      this.startTime = this.getTime();
    }
    this.swap();
    this.noSleep.enable();
    this.interval = setInterval(() => {
      this.time += 1;
      let mins: number | string = Math.floor(this.time / 60);
      let seconds: number | string = Math.floor(this.time % 60);
      if(mins < 10){
        mins = `0${mins}`;
      }
      if(seconds < 10){
        seconds = `0${seconds}`;
      }
      this.timer.innerHTML = `${mins}:${seconds}`;
    }, 1000);
  }

  private stopTimer(){
    this.swap();
    this.noSleep.disable();
    clearInterval(this.interval);
  }

  private showConfirm(){
    this.confirm.style.display = "flex";
  }

  private hideConfirm(){
    this.confirm.style.display = "none";
  }

  private redirectConfirm(){
    if(this.confirmOrigin.dataset.origin === "reset") {
      this.resetTimer();
    } else {
      this.submitData();
    }
  }

  private resetTimer(){
    this.hideConfirm();
    this.buttonState = "stop";
    this.stopTimer();
    this.time = 0;
    this.startTime = "";
    this.timer.innerHTML = "00:00";
    this.volume.value = "";
    this.wee.checked = false;
    this.poo.checked = false;
  }

  private gatherData(): Payload {

    if(this.volume.value === ""){
      this.volume.value = "0";
    }

    return {
      date: this.getDate(),
      time: this.startTime,
      duration: Math.floor(this.time / 60),
      volume: this.volume.value,
      wee: this.wee.checked,
      poo: this.poo.checked
    }
  }

  private submitData(){
    this.hideConfirm();
    console.log(this.gatherData());
    //this.excelController.submitData(this.gatherData());
    this.resetTimer();
  }

}

const myFeedTimer = new FeedController();
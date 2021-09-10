import { StateController } from "./stateController.classes";

export class DOMController {

  private stateController: StateController;
  private start: HTMLDivElement;
  private startFunc: Function;
  private stop: HTMLDivElement;
  private stopFunc: Function;
  private confirm: HTMLDivElement;
  private confirmOrigin: HTMLDivElement;
  private yes: HTMLDivElement
  private no: HTMLDivElement;
  private reset: HTMLDivElement;
  private submit: HTMLDivElement;
  private _timer: HTMLDivElement;
  private _volume: HTMLInputElement;
  private _wee: HTMLInputElement;
  private _poo: HTMLInputElement;
  private resetFunc: Function;
  private submitFunc: Function;
  private plus: HTMLDivElement;
  private minus: HTMLDivElement;



  constructor(stateController: StateController, startFunc: Function, stopFunc: Function, resetFunc: Function, submitFunc: Function) {
    this.stateController = stateController;
    this.start = document.querySelector(".start") as HTMLDivElement;
    this.start.style.display = "block";
    this.startFunc = startFunc;
    this.stop = document.querySelector(".stop") as HTMLDivElement;
    this.stop.style.display = "none";
    this.stopFunc = stopFunc;
    this.confirm = document.querySelector(".confirm") as HTMLDivElement;
    this.confirmOrigin = document.querySelector(".origin") as HTMLDivElement;
    this.yes = document.querySelector(".yes") as HTMLDivElement;
    this.no = document.querySelector(".no") as HTMLDivElement;
    this.reset = document.querySelector(".reset") as HTMLDivElement;
    this.submit = document.querySelector(".submit") as HTMLDivElement;
    this._timer = document.querySelector(".timer") as HTMLDivElement;
    this._volume = document.querySelector(".volume input") as HTMLInputElement;
    this._wee = document.querySelector(".wee") as HTMLInputElement;
    this._poo = document.querySelector(".poo") as HTMLInputElement;
    this.plus = document.querySelector(".plus") as HTMLDivElement;
    this.minus = document.querySelector(".minus") as HTMLDivElement;
    this.resetFunc = resetFunc;
    this.submitFunc = submitFunc;
    this.addEvents();
  }

  private addEvents() {
    this.reset.addEventListener("click", this.showConfirm.bind(this));
    this.reset.addEventListener("click", () => {
      this.confirmOrigin.dataset.origin = "reset";
    });
    this.submit.addEventListener("click", this.showConfirm.bind(this));
    this.submit.addEventListener("click", () => {
      this.confirmOrigin.dataset.origin = "submit";
    });
    this.no.addEventListener("click", this.hideConfirm.bind(this));
    this.yes.addEventListener("click", this.redirectConfirm.bind(this));
    this.start.addEventListener("click", e => {
      this.startFunc();
    });
    this.stop.addEventListener("click", e => {
      this.stopFunc();
    });
    this.plus.addEventListener("click", e => {
      this.stateController.time += 60;
      this.changeTimer("plus");
    });
    this.minus.addEventListener("click", e => {
      this.stateController.time -= 60;
      this.changeTimer("minus");
    });
  }

  public clearDOM() {
    this._timer.innerHTML = "00:00";
    this._volume.value = "";
    this._wee.checked = false;
    this._poo.checked = false;
    this.swapTo("start");
  }
  public showConfirm() {
    this.confirm.style.display = "flex";
  }
  public hideConfirm() {
    this.confirm.style.display = "none";
  }
  private redirectConfirm() {
    if (this.confirmOrigin.dataset.origin === "reset") {
      this.resetFunc();
    } else {
      this.submitFunc();
    }
  }
  private changeTimer(plusminus: string){
    const timesplit = this.timer.split(":");
    const mins = parseInt(timesplit[0]);
    if(plusminus === "plus"){
      if(mins + 1 < 10){
        this.timer = `0${mins + 1}:${timesplit[1]}`;
      } else {
        this.timer = `${mins + 1}:${timesplit[1]}`;
      }
    } else {
      if(mins > 0){
        if(mins - 1 < 10){
          this.timer = `0${mins - 1}:${timesplit[1]}`;
        } else {
          this.timer = `${mins - 1}:${timesplit[1]}`;
        }
      }
    }
  }
  public swapTo(button: "start" | "stop") {
    if (button === "start") {
      this.start.style.display = "block";
      this.stop.style.display = "none";
    } else {
      this.start.style.display = "none";
      this.stop.style.display = "block";
    }
  }
  //GETTERS
  public get volume() {
    return this._volume.value;
  }
  public get wee() {
    return this._wee.checked;
  }
  public get poo() {
    return this._poo.checked;
  }
  //SETTERS
  public set timer(value: string) {
    this._timer.innerHTML = value;
  }
  public set volume(value: string) {
    this._volume.value = value;
  }
}
export class StateController {
  private _buttonState: "start" | "stop";
  private _time: number;
  private _startTime: string;
  private wakeLock: any;


  constructor(button: "start" | "stop", time: number, start: string) {
    this._buttonState = button;
    this._time = time;
    this._startTime = start;
    this.wakeLock = null;
  }

  public clearState() {
    this.time = 0;
    this.startTime = "";
    this.buttonState = "stop";
  }

  public async lockScreen() {
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
    } catch (err: any) {
      // The Wake Lock request has failed - usually system related, such as battery.
      console.log(`${err.name}, ${err.message}`);
    }
  }

  public async releaseLock() {
    try {
      await this.wakeLock.release();
      this.wakeLock = null;
    } catch (err: any) {
      // The Wake Lock request has failed - usually system related, such as battery.
      console.log(`${err.name}, ${err.message}`);
    }
  }

  //GETTERS
  public get buttonState() {
    return this._buttonState;
  }
  public get time() {
    return this._time;
  }
  public get startTime() {
    return this._startTime;
  }
  //SETTERS
  public set buttonState(state: "start" | "stop") {
    this._buttonState = state;
  }
  public set time(state: number) {
    this._time = state;
  }
  public set startTime(state: string) {
    this._startTime = state;
  }
}
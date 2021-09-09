export class DOMController {
    constructor(startFunc, stopFunc, resetFunc, submitFunc) {
        this.start = document.querySelector(".start");
        this.start.style.display = "block";
        this.startFunc = startFunc;
        this.stop = document.querySelector(".stop");
        this.stop.style.display = "none";
        this.stopFunc = stopFunc;
        this.confirm = document.querySelector(".confirm");
        this.confirmOrigin = document.querySelector(".origin");
        this.yes = document.querySelector(".yes");
        this.no = document.querySelector(".no");
        this.reset = document.querySelector(".reset");
        this.submit = document.querySelector(".submit");
        this._timer = document.querySelector(".timer");
        this._volume = document.querySelector(".volume input");
        this._wee = document.querySelector(".wee");
        this._poo = document.querySelector(".poo");
        this.resetFunc = resetFunc;
        this.submitFunc = submitFunc;
        this.addEvents();
    }
    addEvents() {
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
    }
    clearDOM() {
        this._timer.innerHTML = "00:00";
        this._volume.value = "";
        this._wee.checked = false;
        this._poo.checked = false;
        this.swapTo("start");
    }
    showConfirm() {
        this.confirm.style.display = "flex";
    }
    hideConfirm() {
        this.confirm.style.display = "none";
    }
    redirectConfirm() {
        if (this.confirmOrigin.dataset.origin === "reset") {
            this.resetFunc();
        }
        else {
            this.submitFunc();
        }
    }
    swapTo(button) {
        if (button === "start") {
            this.start.style.display = "block";
            this.stop.style.display = "none";
        }
        else {
            this.start.style.display = "none";
            this.stop.style.display = "block";
        }
    }
    //GETTERS
    get volume() {
        return this._volume.value;
    }
    get wee() {
        return this._wee.checked;
    }
    get poo() {
        return this._poo.checked;
    }
    //SETTERS
    set timer(value) {
        this._timer.innerHTML = value;
    }
    set volume(value) {
        this._volume.value = value;
    }
}

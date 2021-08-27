"use strict";
var noSleep = require("nosleep.js");
var ExcelController = /** @class */ (function () {
    function ExcelController() {
        this.url = "https://script.google.com/macros/s/AKfycbxgxWrVabiImPsUpXTEMdljI5jlFAMt-jBihMKTzOQiSVlJlgF7jGKu3bp27n9sgywh/exec";
    }
    ExcelController.prototype.submitData = function (payload) {
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
    };
    return ExcelController;
}());
var FeedController = /** @class */ (function () {
    function FeedController() {
        this.setup();
        this.addEvents();
    }
    FeedController.prototype.setup = function () {
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
        this.noSleep = new noSleep();
    };
    FeedController.prototype.addEvents = function () {
        var _this = this;
        this.start.addEventListener("click", this.startTimer.bind(this));
        this.stop.addEventListener("click", this.stopTimer.bind(this));
        this.reset.addEventListener("click", this.showConfirm.bind(this));
        this.reset.addEventListener("click", function () {
            _this.confirmOrigin.dataset.origin = "reset";
        });
        this.yes.addEventListener("click", this.redirectConfirm.bind(this));
        this.no.addEventListener("click", this.hideConfirm.bind(this));
        this.submit.addEventListener("click", this.showConfirm.bind(this));
        this.submit.addEventListener("click", function () {
            _this.confirmOrigin.dataset.origin = "submit";
        });
    };
    FeedController.prototype.swap = function () {
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
    };
    FeedController.prototype.getTime = function () {
        var date = new Date();
        return date.getHours() + ":" + date.getMinutes();
    };
    FeedController.prototype.getDate = function () {
        var date = new Date();
        return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    };
    FeedController.prototype.startTimer = function () {
        var _this = this;
        if (this.startTime === "") {
            this.startTime = this.getTime();
        }
        this.swap();
        this.noSleep.enable();
        this.interval = setInterval(function () {
            _this.time += 1;
            var mins = Math.floor(_this.time / 60);
            var seconds = Math.floor(_this.time % 60);
            if (mins < 10) {
                mins = "0" + mins;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            _this.timer.innerHTML = mins + ":" + seconds;
        }, 1000);
    };
    FeedController.prototype.stopTimer = function () {
        this.swap();
        this.noSleep.disable();
        clearInterval(this.interval);
    };
    FeedController.prototype.showConfirm = function () {
        this.confirm.style.display = "flex";
    };
    FeedController.prototype.hideConfirm = function () {
        this.confirm.style.display = "none";
    };
    FeedController.prototype.redirectConfirm = function () {
        if (this.confirmOrigin.dataset.origin === "reset") {
            this.resetTimer();
        }
        else {
            this.submitData();
        }
    };
    FeedController.prototype.resetTimer = function () {
        this.hideConfirm();
        this.buttonState = "stop";
        this.stopTimer();
        this.time = 0;
        this.startTime = "";
        this.timer.innerHTML = "00:00";
        this.volume.value = "";
        this.wee.checked = false;
        this.poo.checked = false;
    };
    FeedController.prototype.gatherData = function () {
        if (this.volume.value === "") {
            this.volume.value = "0";
        }
        return {
            date: this.getDate(),
            time: this.startTime,
            duration: Math.floor(this.time / 60),
            volume: this.volume.value,
            wee: this.wee.checked,
            poo: this.poo.checked
        };
    };
    FeedController.prototype.submitData = function () {
        this.hideConfirm();
        console.log(this.gatherData());
        this.excelController.submitData(this.gatherData());
        this.resetTimer();
    };
    return FeedController;
}());
var myFeedTimer = new FeedController();

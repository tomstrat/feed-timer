import {Payload} from "../interfaces/payload.interface.js";

export class ExcelController {
  private url: string;

  constructor(){
    this.url = "https://script.google.com/macros/s/AKfycbxgxWrVabiImPsUpXTEMdljI5jlFAMt-jBihMKTzOQiSVlJlgF7jGKu3bp27n9sgywh/exec";
  }


  public submitData(payload: Payload) {
    fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        data: payload
      })
    });
  }
}

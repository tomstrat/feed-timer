export class ExcelController {
    constructor() {
        this.url = "https://script.google.com/macros/s/AKfycbxgxWrVabiImPsUpXTEMdljI5jlFAMt-jBihMKTzOQiSVlJlgF7jGKu3bp27n9sgywh/exec";
    }
    submitData(payload) {
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

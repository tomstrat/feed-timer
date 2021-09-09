export class DOMController {

  private confirm: HTMLDivElement;

  constructor() {
    this.confirm = document.querySelector(".confirm") as HTMLDivElement;
  }

  public showConfirm() {
    this.confirm.style.display = "flex";
  }
  public hideConfirm() {
    this.confirm.style.display = "none";
  }
}
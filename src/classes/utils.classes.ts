export class Utils {
  constructor() {

  }
  public getTime(): string {
    let date = new Date();
    let mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${date.getHours()}:${mins}`;
  }

  public getDate(): string {
    let date = new Date();
    const dateString = date.toLocaleDateString("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit"
    })
    return dateString;
  }
}
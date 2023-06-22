import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timer"
})
export class TimerPipe implements PipeTransform {
  transform(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const displayTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return displayTime;
  }
}

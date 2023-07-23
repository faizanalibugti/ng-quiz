import { ImageOption } from "@angular-quiz/api-interfaces";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shuffle",
})
export class ShufflePipe<T> implements PipeTransform {
  storeShuffle!: T[];

  transform(input: T[], response: T | undefined): T[] {
    if (!Array.isArray(input)) {
      return input;
    }

    if (response) {
      return this.storeShuffle;
    }

    const shuffled = [...input];
    const n = input.length - 1;
    for (let i = 0; i < n; ++i) {
      const j = Math.floor(Math.random() * (n - i + 1)) + i;
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return (this.storeShuffle = shuffled);
  }
}

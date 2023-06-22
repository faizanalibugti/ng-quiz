import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Timer } from "src/app/+state/models/timer.model";

@Component({
  selector: "angular-quiz-quiz-info",
  templateUrl: "./quiz-info.component.html",
  styleUrls: ["./quiz-info.component.scss"],
})
export class QuizInfoComponent {
  @Input() currentQuestionNumber!: number;
  @Input() totalQuestions!: number;
  @Input() score!: number;

  @Input() timer!: Timer | undefined;
}

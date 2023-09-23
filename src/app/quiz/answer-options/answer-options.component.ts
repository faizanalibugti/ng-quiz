import { ImageOption, QuestionType } from "@angular-quiz/api-interfaces";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { QuizMode } from "../../+state/quiz/models/quiz-mode.model";

@Component({
  selector: "angular-quiz-answer-options",
  templateUrl: "./answer-options.component.html",
  styleUrls: ["./answer-options.component.scss"],
})
export class AnswerOptionsComponent {
  @Input() questionType!: QuestionType;
  @Input() questionId!: string;

  @Input() answerChoices: string[] | ImageOption[] = [];
  @Input() response?: string | ImageOption;
  @Input() correctAnswer!: string | ImageOption;
  @Input() quizMode!: QuizMode | undefined;

  @Output() userResponse = new EventEmitter<{
    selectedOption: string | ImageOption;
    questionId: string;
  }>();

  recordResponse(selectedOption: string | ImageOption, questionId: string) {
    this.userResponse.emit({ selectedOption, questionId });
  }
}

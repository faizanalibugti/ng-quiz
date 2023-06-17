import { ImageOption, QuestionType } from "@angular-quiz/api-interfaces";
import { Component, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "angular-quiz-answer-options",
  templateUrl: "./answer-options.component.html",
  styleUrls: ["./answer-options.component.scss"],
})
export class AnswerOptionsComponent {
  @Input() questionType!: QuestionType;
  @Input() questionId!: string;
  @Input() answerChoices!: string[] | ImageOption[];
  @Input() response?: string | ImageOption;
  @Input() correctAnswer!: string | ImageOption;

  @Output() userResponse: EventEmitter<{
    selectedOption: string | ImageOption;
    questionId: string;
  }> = new EventEmitter<{
    selectedOption: string | ImageOption;
    questionId: string;
  }>();

  recordResponse(selectedOption: string | ImageOption, questionId: string) {
    this.userResponse.emit({ selectedOption, questionId });
  }
}

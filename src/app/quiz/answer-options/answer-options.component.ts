import { ImageOption, QuestionType } from "@angular-quiz/api-interfaces";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { QuizMode } from "src/app/+state/models/quiz-mode.model";

@Component({
  selector: "angular-quiz-answer-options",
  templateUrl: "./answer-options.component.html",
  styleUrls: ["./answer-options.component.scss"],
})
export class AnswerOptionsComponent {
  textOptions!: string[];
  imageOptions!: ImageOption[];

  @Input() questionType!: QuestionType;
  @Input() questionId!: string;

  @Input() set answerChoices(value: string[] | ImageOption[]) {
    this.questionType === QuestionType.TEXT_CHOICE
      ? (this.textOptions = value as string[])
      : (this.imageOptions = value as ImageOption[]);
  }

  @Input() response?: string | ImageOption;
  @Input() correctAnswer!: string | ImageOption;
  @Input() quizMode!: QuizMode;

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

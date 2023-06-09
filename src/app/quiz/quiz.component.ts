import { ImageOption } from "@angular-quiz/api-interfaces";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { QuizViewState } from "../+state/models/quiz-view.model";
import { quizViewState } from "../+state/views/quiz-views.selectors";
import * as QuizActions from "../../app/+state/quiz.actions";

@Component({
  selector: "angular-quiz-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizComponent {
  quiz$!: Observable<QuizViewState>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.quiz$ = this.store.select(quizViewState);
  }

  recordResponse(response: {
    selectedOption: string | ImageOption;
    questionId: string;
  }): void {
    let { selectedOption, questionId } = response;

    this.store.dispatch(
      QuizActions.quizActions.answerQuestion({
        questionId,
        response: selectedOption,
      })
    );
  }

  skipQuestion() {
    this.store.dispatch(QuizActions.quizActions.skipQuestion());
  }
  
  nextQuestion() {
    this.store.dispatch(QuizActions.quizActions.nextQuestion());
  }

  finishQuiz() {
    this.store.dispatch(QuizActions.quizActions.submitQuiz());
  }
}

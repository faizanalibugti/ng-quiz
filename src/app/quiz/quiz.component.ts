import { ImageOption } from "@angular-quiz/api-interfaces";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { QuizViewState } from "../+state/quiz/models/quiz-view.model";
import { selectQuizViewState } from "../+state/quiz/views/quiz-views.selectors";
import * as QuizActions from "../../app/+state/quiz/quiz.actions";

@Component({
  selector: "angular-quiz-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  private readonly store = inject(Store);

  quiz$!: Observable<QuizViewState>;

  ngOnInit(): void {
    this.quiz$ = this.store.select(selectQuizViewState);
  }

  recordResponse(response: {
    selectedOption: string | ImageOption;
    questionId: string;
  }): void {
    const { selectedOption, questionId } = response;

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

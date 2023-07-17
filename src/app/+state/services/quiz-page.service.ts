import { Injectable, inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { triviaFormViewState } from "../views/trivia-form-views.selectors";
import { quizViewState } from "../views/quiz-views.selectors";
import { resultViewState } from "../views/result-views.selectors";

@Injectable({
  providedIn: "root",
})
export class QuizPageService {
  private store = inject(Store);

  displayTriviaFormPage() {
    return this.store.pipe(select(triviaFormViewState));
  }

  displayQuizPage() {
    return this.store.pipe(select(quizViewState));
  }

  displayResultsPage() {
    return this.store.pipe(select(resultViewState));
  }  
}

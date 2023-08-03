import { Injectable, inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { selectQuizViewState } from "../views/quiz-views.selectors";
import { selectResultViewState } from "../views/result-views.selectors";
import { selectTriviaFormViewState } from "../views/trivia-form-views.selectors";

@Injectable({
  providedIn: "root",
})
/**
 * TODO
 * Implement handleItemAction and utilize the service across dependent components
 * to use the facade pattern
 */
export class QuizPageService {
  private store = inject(Store);

  displayTriviaFormPage() {
    return this.store.pipe(select(selectTriviaFormViewState));
  }

  displayQuizPage() {
    return this.store.pipe(select(selectQuizViewState));
  }

  displayResultsPage() {
    return this.store.pipe(select(selectResultViewState));
  }
}

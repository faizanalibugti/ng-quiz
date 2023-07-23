import { TriviaQueryParams } from "@angular-quiz/api-interfaces";
import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { QuizMode } from "../+state/models/quiz-mode.model";
import { TriviaFormViewState } from "../+state/models/trivia-form-view.model";
import { selectTriviaFormViewState } from "../+state/views/trivia-form-views.selectors";
import * as QuizActions from "../../app/+state/quiz.actions";

@Component({
  selector: "angular-quiz-trivia-form",
  templateUrl: "./trivia-form.component.html",
  styleUrls: ["./trivia-form.component.scss"],
})
export class TriviaFormComponent implements OnInit {
  private readonly store = inject(Store);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  trivia$!: Observable<TriviaFormViewState>;

  triviaForm = this.fb.nonNullable.group({
    name: ["Elliot Alderson", [Validators.required]],
    mode: ["practice" as QuizMode],
    limit: [10],
    categories: [[""]],
    difficulties: [[""]],
    types: [[""]],
  });

  ngOnInit(): void {
    this.store.dispatch(QuizActions.quizActions.loadCategories());

    this.trivia$ = this.store.select(selectTriviaFormViewState);
  }

  submitForm() {
    const { name, mode, ...triviaQueryParams } = this.triviaForm.value;

    if (name && mode) {
      this.store.dispatch(
        QuizActions.quizActions.loadQuiz({
          options: triviaQueryParams as TriviaQueryParams,
          mode,
          name,
        })
      );
    }

    this.triviaForm.reset();

    this.router.navigate(["quiz"]);
  }
}

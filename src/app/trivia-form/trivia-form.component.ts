import { TriviaQueryParams } from "@angular-quiz/api-interfaces";
import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { TriviaFormViewState } from "../+state/quiz/models/trivia-form-view.model";
import { selectTriviaFormViewState } from "../+state/quiz/views/trivia-form-views.selectors";
import * as QuizActions from "../../app/+state/quiz/quiz.actions";

@Component({
  selector: "angular-quiz-trivia-form",
  templateUrl: "./trivia-form.component.html",
  styleUrls: ["./trivia-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriviaFormComponent implements OnInit {
  private readonly store = inject(Store);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  trivia$!: Observable<TriviaFormViewState>;
  triviaForm!: FormGroup;

  ngOnInit(): void {
    this.store.dispatch(QuizActions.quizActions.loadCategories());

    this.trivia$ = this.store.select(selectTriviaFormViewState);
    this.buildForm();
  }

  buildForm() {
    this.triviaForm = this.fb.nonNullable.group({
      name: ["Elliot Alderson", Validators.required],
      mode: ["practice", Validators.required],
      limit: [10],
      categories: [[""]],
      difficulties: [[""]],
      types: [[""]],
    });
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

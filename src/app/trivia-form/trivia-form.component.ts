import {
  TriviaCategories,
  TriviaQueryParams,
} from "@angular-quiz/api-interfaces";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectTriviaCategories } from "../+state/quiz.selectors";
import * as QuizActions from "../../app/+state/quiz.actions";
import { FormBuilder, Validators } from "@angular/forms";
import { QuizMode } from "../+state/views/models/quiz-mode.model";

@Component({
  selector: "angular-quiz-trivia-form",
  templateUrl: "./trivia-form.component.html",
  styleUrls: ["./trivia-form.component.scss"],
})
export class TriviaFormComponent implements OnInit {
  difficulty = ["easy", "medium", "hard"];
  types = { "Text Choice": "text_choice", "Image Choice": "image_choice" };
  modes = [
    {
      type: QuizMode.PRACTICE,
      toolTip: "A un-timed mode to practice your trivia skills",
    },
    {
      type: QuizMode.TRIVIA_CHALLENGE,
      toolTip: "A timed challenge to test your trivia skills",
    },
  ];
  categories$!: Observable<TriviaCategories>;

  constructor(
    private readonly store: Store,
    private router: Router,
    private fb: FormBuilder
  ) {}

  triviaForm = this.fb.nonNullable.group({
    name: ["Elliot Alderson", [Validators.required]],
    mode: ["practice" as QuizMode],
    limit: [5],
    categories: [[""]],
    difficulties: [[""]],
    types: [[""]],
  });

  ngOnInit(): void {
    this.store.dispatch(QuizActions.quizActions.loadCategories());

    this.categories$ = this.store.select(selectTriviaCategories);
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

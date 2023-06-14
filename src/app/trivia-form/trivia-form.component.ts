import { TriviaCategories, TriviaOptions } from "@angular-quiz/api-interfaces";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectTriviaCategories } from "../+state/quiz.selectors";
import * as QuizActions from "../../app/+state/quiz.actions";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "angular-quiz-trivia-form",
  templateUrl: "./trivia-form.component.html",
  styleUrls: ["./trivia-form.component.scss"],
})
export class TriviaFormComponent implements OnInit {
  difficulty = ["easy", "medium", "hard"];
  types = { "Text Choice": "text_choice", "Image Choice": "image_choice" };
  categories!: Observable<TriviaCategories>;

  constructor(
    private readonly store: Store,
    private router: Router,
    private fb: FormBuilder
  ) {}

  triviaForm = this.fb.nonNullable.group({
    limit: [5],
    categories: [[""]],
    difficulties: [[""]],
    types: [[""]],
  });

  ngOnInit(): void {
    this.store.dispatch(QuizActions.quizActions.loadCategories());

    this.categories = this.store.select(selectTriviaCategories);
  }

  submitForm() {
    this.store.dispatch(
      QuizActions.quizActions.loadQuiz({
        options: this.triviaForm.value as TriviaOptions,
      })
    );

    this.router.navigate(["quiz"]);
  }
}

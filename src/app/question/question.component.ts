import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as QuizActions from "../../app/+state/quiz.actions";
import { QuizViewState, quizViewState } from "../+state/quiz.selectors";
import { Router } from "@angular/router";
import { ImageOption } from "@angular-quiz/api-interfaces";

@Component({
  selector: "angular-quiz-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"],
})
export class QuestionComponent implements OnInit {
  quiz!: Observable<QuizViewState>;

  constructor(private readonly store: Store, private router: Router) {}

  ngOnInit(): void {
    this.quiz = this.store.select(quizViewState);
  }

  nextQuestion() {
    this.store.dispatch(QuizActions.quizActions.nextQuestiom());
  }

  recordResponse(option: string | ImageOption, questionId: string) {
    this.store.dispatch(
      QuizActions.quizActions.answerQuestion({
        questionId,
        response: option,
      })
    );
  }

  finishQuiz() {
    this.router.navigate([""]);
  }
}

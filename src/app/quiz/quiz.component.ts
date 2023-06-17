import { ImageOption } from '@angular-quiz/api-interfaces';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QuizViewState } from '../+state/views/models/quiz-view.model';
import { quizViewState } from '../+state/views/quiz-views.selectors';
import * as QuizActions from "../../app/+state/quiz.actions";

@Component({
  selector: 'angular-quiz-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  quiz!: Observable<QuizViewState>;

  constructor(private readonly store: Store, private router: Router) {}

  ngOnInit(): void {
    this.quiz = this.store.select(quizViewState);
  }

  nextQuestion() {
    this.store.dispatch(QuizActions.quizActions.nextQuestion());
  }

  recordResponse(option: string | ImageOption, questionId: string) {
    this.store.dispatch(
      QuizActions.quizActions.answerQuestion({
        questionId,
        response: option,
      })
    );
  }

  skipQuestion() {
    this.store.dispatch(QuizActions.quizActions.skipQuestion());
  }
}

import { TriviaCategories } from '@angular-quiz/api-interfaces';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTriviaCategories } from '../+state/quiz.selectors';
import * as QuizActions from '../../app/+state/quiz.actions';

@Component({
  selector: 'angular-quiz-trivia-form',
  templateUrl: './trivia-form.component.html',
  styleUrls: ['./trivia-form.component.scss'],
})
export class TriviaFormComponent implements OnInit {
  difficulty = ['easy', 'medium', 'hard'];
  triviaOptions = { limit: 5, categories: 'arts_and_literature', difficulty: 'easy' };
  categories!: Observable<TriviaCategories>;

  constructor(private readonly store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(QuizActions.quizActions.loadCategories());

    this.categories = this.store.select(selectTriviaCategories);
  }

  submitForm(form: any) {
    this.store.dispatch(
      QuizActions.quizActions.loadQuiz({ options: this.triviaOptions })
    );

    this.router.navigate(['quiz']);
  }
}

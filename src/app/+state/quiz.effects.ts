import { TriviaCategories, TriviaOptions } from '@angular-quiz/api-interfaces';
import { QuizService } from '@angular-quiz/core-data';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import * as QuizActions from './quiz.actions';
import * as QuizSelectors from './quiz.selectors';

@Injectable()
export class QuizEffects {
  loadTriviaCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuizActions.quizActions.loadCategories),
      concatMap(() =>
        this.quizService.getCategories().pipe(
          map((categrories) => formatTriviaCategories(categrories)),
          map((data) =>
            QuizActions.quizApiActions.loadCategoriesSuccess({ data })
          ),
          catchError((error) =>
            of(QuizActions.quizApiActions.loadQuizFailure({ error }))
          )
        )
      )
    );
  });

  loadQuizQuestions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuizActions.quizActions.loadQuiz),
      switchMap(({ options }) =>
        this.quizService.getQuestions(options).pipe(
          map((data) => QuizActions.quizApiActions.loadQuizSuccess({ data })),
          catchError((error) =>
            of(QuizActions.quizApiActions.loadQuizFailure({ error }))
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private quizService: QuizService,
    private readonly store: Store
  ) {}
}

function formatTriviaCategories(
  categrories: TriviaCategories
): TriviaCategories {
  const triviaCategories: TriviaCategories = {};
  for (const key in categrories) {
    categrories[key].map((tag, index, tagArr) => {
      if (tagArr.length > 1 && tag.includes('_')) {
        triviaCategories[key] = [tag];
      } else {
        triviaCategories[key] = [tag];
      }
    });
  }

  return triviaCategories;
}

import { TriviaCategories } from "@angular-quiz/api-interfaces";
import { QuizService } from "@angular-quiz/core-data";
import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, concatMap, filter, map, switchMap } from "rxjs/operators";
import * as QuizActions from "./quiz.actions";
import * as QuizSelectors from "./quiz.selectors";
import { Router } from "@angular/router";

@Injectable()
export class QuizEffects {
  constructor(
    private actions$: Actions,
    private readonly store: Store,
    private quizService: QuizService,
    private router: Router
  ) {}

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

  endQuiz$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          QuizActions.quizActions.nextQuestion,
          QuizActions.quizActions.skipQuestion
        ),
        concatLatestFrom(() => [
          this.store.select(QuizSelectors.selectNumberOfQuestions),
          this.store.select(QuizSelectors.selectCurrentIndex),
        ]),
        filter(
          ([_, totalQuestions, currentIndex]) =>
            currentIndex + 1 > totalQuestions
        ),
        map(() => this.router.navigate([""]))
      ),
    { dispatch: false }
  );
}

function formatTriviaCategories(
  categrories: TriviaCategories
): TriviaCategories {
  const triviaCategories: TriviaCategories = {};
  for (const key in categrories) {
    categrories[key].map((tag, index, tagArr) => {
      if (tagArr.length > 1 && tag.includes("_")) {
        triviaCategories[key] = [tag];
      } else {
        triviaCategories[key] = [tag];
      }
    });
  }

  return triviaCategories;
}

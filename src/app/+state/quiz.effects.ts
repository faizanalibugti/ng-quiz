import { TriviaCategories } from "@angular-quiz/api-interfaces";
import { QuizService } from "@angular-quiz/core-data";
import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { interval, of, timer } from "rxjs";
import {
  catchError,
  concatMap,
  filter,
  map,
  scan,
  switchMap,
  takeUntil,
} from "rxjs/operators";
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

  timerStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.quizApiActions.loadQuizSuccess),
      concatLatestFrom(() => [
        this.store.select(QuizSelectors.selectNumberOfQuestions),
        this.store.select(QuizSelectors.selectTimer),
      ]),
      switchMap(([_, totalQuestions, timeLeft]) =>
        interval(1000).pipe(
          scan((acc) => --acc, totalQuestions * 10),
          map((remainingTime) =>
            QuizActions.quizActions.updateTimer({
              remainingTime,
            })
          ),
          takeUntil(this.actions$.pipe(ofType(QuizActions.quizActions.timesUp)))
        )
      )
    )
  );

  timerEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.quizActions.updateTimer),
      filter(({ remainingTime }) => remainingTime === 0),
      map(() => QuizActions.quizActions.timesUp())
    )
  );

  endQuiz$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          QuizActions.quizActions.nextQuestion,
          QuizActions.quizActions.skipQuestion,
          QuizActions.quizActions.timesUp
        ),
        concatLatestFrom(() => [
          this.store.select(QuizSelectors.selectNumberOfQuestions),
          this.store.select(QuizSelectors.selectCurrentIndex),
        ]),
        filter(
          ([{ type }, totalQuestions, currentIndex]) =>
            currentIndex + 1 > totalQuestions || type === "[Quiz] Times Up"
        ),
        map(() => this.router.navigate(["result"]))
      ),
    { dispatch: false }
  );
}

function formatTriviaCategories(
  categrories: TriviaCategories
): TriviaCategories {
  const triviaCategories: TriviaCategories = {};

  for (const key in categrories) {
    let categoryValue = categrories[key].filter((value, index, array) =>
      array.length === 1 ? value : value.includes("_")
    );

    triviaCategories[key] = categoryValue;
  }

  return triviaCategories;
}

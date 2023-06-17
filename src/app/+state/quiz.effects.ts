import { NotificationsService, QuizHttpService } from "@angular-quiz/core-data";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { interval, of } from "rxjs";
import {
  catchError,
  concatMap,
  filter,
  map,
  scan,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import * as QuizActions from "./quiz.actions";
import * as QuizSelectors from "./quiz.selectors";
import * as QuizViewSelectors from "./views/quiz-views.selectors";
import { formatTriviaCategories } from "./utils/quiz.utils";
import { Title } from "@angular/platform-browser";

@Injectable()
export class QuizEffects {
  constructor(
    private actions$: Actions,
    private readonly store: Store,
    private quizService: QuizHttpService,
    private notificationsService: NotificationsService,
    private titleService: Title,
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
      ]),
      switchMap(([_, totalQuestions]) =>
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
      concatLatestFrom(() => [
        this.store.select(QuizSelectors.selectTimer),
        this.store.select(QuizViewSelectors.displayTimer),
      ]),
      map(([{ remainingTime }, {}, { displayTime }]) => {
        this.titleService.setTitle(`Trivia Quiz - ${displayTime}`);
        return { remainingTime };
      }),
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

  loadQuizError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          QuizActions.quizApiActions.loadCategoriesFailure,
          QuizActions.quizApiActions.loadQuizFailure
        ),
        tap(() => {
          this.notificationsService.openSnackBar(
            "Something went wrong. Please try again later"
          );
        })
      ),
    { dispatch: false }
  );
}

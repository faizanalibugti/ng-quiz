import { NotificationsService, QuizHttpService } from "@angular-quiz/core-data";
import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
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
import { formatTriviaCategories } from "./utils/quiz.utils";
import * as QuizViewSelectors from "./views/quiz-views.selectors";
import { ROUTER_NAVIGATED } from "@ngrx/router-store";
import { TimerPipe } from "libs/core-data/src/lib/pipes/timer/timer.pipe";

@Injectable()
export class QuizEffects {
  constructor(
    private actions$: Actions,
    private readonly store: Store,
    private quizService: QuizHttpService,
    private notificationsService: NotificationsService,
    private titleService: Title,
    private router: Router,
    private timerPipe: TimerPipe
  ) {}

  loadTriviaCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuizActions.quizActions.loadCategories),
      concatLatestFrom(() =>
        this.store.select(QuizSelectors.selectTriviaCategories)
      ),
      filter(([{}, triviaCategories]) => !triviaCategories),
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

  loadQuizQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.quizActions.loadQuiz),
      switchMap(({ options }) =>
        this.quizService.getQuestions(options).pipe(
          map((data) => QuizActions.quizApiActions.loadQuizSuccess({ data })),
          catchError((error) =>
            of(QuizActions.quizApiActions.loadQuizFailure({ error }))
          )
        )
      )
    )
  );

  timerStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.quizApiActions.loadQuizSuccess),
      concatLatestFrom(() => [
        this.store.select(QuizSelectors.selectNumberOfQuestions),
        this.store.select(QuizSelectors.selectTimerActive),
      ]),
      filter(([_, totalQuestions, isTimerActive]) => isTimerActive),
      switchMap(([_, totalQuestions]) =>
        interval(1000).pipe(
          scan((acc) => --acc, totalQuestions * 10),
          map((remainingTime) =>
            QuizActions.quizActions.updateTimer({
              remainingTime,
            })
          ),
          takeUntil(
            this.actions$.pipe(
              ofType(
                ROUTER_NAVIGATED,
                QuizActions.quizActions.timesUp,
                QuizActions.quizActions.submitQuiz
              )
            )
          )
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
        this.store.select(QuizSelectors.selectTimerActive),
      ]),
      map(([{ remainingTime }, _, quizTime]) => {
        if (quizTime) {
          this.titleService.setTitle(
            `Trivia Quiz -  ⌛ ${this.timerPipe.transform(quizTime.remainingTime)}`
          );
        }
        return { remainingTime };
      }),
      filter(({ remainingTime }) => remainingTime === 0),
      map(() => QuizActions.quizActions.timesUp())
    )
  );

  showResult$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          QuizActions.quizActions.submitQuiz,
          QuizActions.quizActions.timesUp
        ),
        map(() => this.router.navigate(["result"]))
      ),
    { dispatch: false }
  );

  showResultOnSkippingLastQuestion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(QuizActions.quizActions.skipQuestion),
        concatLatestFrom(() => [
          this.store.select(QuizSelectors.selectNumberOfQuestions),
          this.store.select(QuizSelectors.selectCurrentIndex),
        ]),
        filter(
          ([{ type }, totalQuestions, currentQuestionNumber]) =>
            currentQuestionNumber >= totalQuestions
        ),
        map(() => this.router.navigate(["result"]))
      ),
    { dispatch: false }
  );

  handleQuizError$ = createEffect(
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

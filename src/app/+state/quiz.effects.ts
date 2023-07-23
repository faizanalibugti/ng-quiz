import {
  NotificationsService,
  QuizHttpService,
  TimerPipe,
} from "@angular-quiz/core-data";
import { Injectable, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { ROUTER_NAVIGATED } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { of, timer } from "rxjs";
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

@Injectable()
export class QuizEffects {
  private actions$ = inject(Actions);
  private readonly store = inject(Store);
  private quizService = inject(QuizHttpService);
  private notificationsService = inject(NotificationsService);
  private titleService = inject(Title);
  private router = inject(Router);
  private timerPipe = inject(TimerPipe);

  loadTriviaCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuizActions.quizActions.loadCategories),
      concatLatestFrom(() =>
        this.store.select(QuizSelectors.selectTriviaCategories)
      ),
      filter(([, triviaCategories]) => !triviaCategories),
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

  timerStart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuizActions.quizApiActions.loadQuizSuccess),
      concatLatestFrom(() => [
        this.store.select(QuizSelectors.selectNumberOfQuestions),
        this.store.select(QuizSelectors.selectTimerActive),
      ]),
      filter(([, , isTimerActive]) => isTimerActive),
      switchMap(([, totalQuestions]) =>
        timer(0, 1000).pipe(
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
    );
  });

  timerEnd$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuizActions.quizActions.updateTimer),
      concatLatestFrom(() => [
        this.store.select(QuizSelectors.selectTimer),
        this.store.select(QuizViewSelectors.selectDisplayTimer),
        this.store.select(QuizSelectors.selectTimerActive),
      ]),
      map(([{ remainingTime }, , quizTime]) => {
        if (quizTime) {
          this.titleService.setTitle(
            `Trivia Quiz -  ⌛ ${this.timerPipe.transform(
              quizTime.remainingTime
            )}`
          );
        }
        return { remainingTime };
      }),
      filter(({ remainingTime }) => remainingTime === 0),
      map(() => QuizActions.quizActions.timesUp())
    );
  });

  showResult$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          QuizActions.quizActions.submitQuiz,
          QuizActions.quizActions.timesUp
        ),
        map(() => this.router.navigate(["result"]))
      );
    },
    { dispatch: false }
  );

  showResultOnSkippingLastQuestion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(QuizActions.quizActions.skipQuestion),
        concatLatestFrom(() => [
          this.store.select(QuizSelectors.selectNumberOfQuestions),
          this.store.select(QuizSelectors.selectCurrentIndex),
        ]),
        filter(
          ([, totalQuestions, currentQuestionNumber]) =>
            currentQuestionNumber >= totalQuestions
        ),
        map(() => this.router.navigate(["result"]))
      );
    },
    { dispatch: false }
  );

  handleQuizError$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          QuizActions.quizApiActions.loadCategoriesFailure,
          QuizActions.quizApiActions.loadQuizFailure
        ),
        tap(() => {
          this.notificationsService.openSnackBar(
            "Something went wrong. Please try again later"
          );
        })
      );
    },
    { dispatch: false }
  );
}

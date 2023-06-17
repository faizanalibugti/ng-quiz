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
                QuizActions.quizActions.timesUp,
                QuizActions.quizActions.submitQuiz,
                QuizActions.quizActions.skipQuestion
              ),
              concatLatestFrom(() => [
                this.store.select(QuizSelectors.selectNumberOfQuestions),
                this.store.select(QuizSelectors.selectCurrentIndex),
              ]),
              filter(
                ([{ type }, totalQuestions, currentQuestionNumber]) =>
                  (type === "[Quiz] Skip Question" &&
                    currentQuestionNumber >= totalQuestions) ||
                  type !== "[Quiz] Skip Question"
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
      filter(([_, remainingTime, quizTime, isTimerActive]) => isTimerActive),
      map(([{ remainingTime }, _, quizTime]) => {
        if (quizTime) {
          this.titleService.setTitle(
            `Trivia Quiz -  ⌛ ${quizTime.displayTime}`
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
          QuizActions.quizActions.skipQuestion,
          QuizActions.quizActions.submitQuiz,
          QuizActions.quizActions.timesUp
        ),
        concatLatestFrom(() => [
          this.store.select(QuizSelectors.selectNumberOfQuestions),
          this.store.select(QuizSelectors.selectCurrentIndex),
        ]),
        filter(
          ([{ type }, totalQuestions, currentQuestionNumber]) =>
            (type === "[Quiz] Skip Question" &&
              currentQuestionNumber >= totalQuestions) ||
            type !== "[Quiz] Skip Question"
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

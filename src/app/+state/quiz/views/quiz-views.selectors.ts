import { Question } from '@angular-quiz/api-interfaces';
import { createSelector } from '@ngrx/store';
import { QuizViewState } from '../models/quiz-view.model';
import { Timer, TimerStatus } from '../models/timer.model';
import {
  selectCurrentIndex,
  selectCurrentQuestion,
  selectIsTimerActive,
  selectLoaded,
  selectScore,
  selectSelectedMode,
  selectTimer,
  selectTotal,
} from '../quiz.reducer';
import { mapQuestionToUI } from '../utils/quiz.utils';

const selectDisplayQuestion = createSelector(
  selectCurrentQuestion,
  (question: Question) => {
    if (question) {
      const questionDetail = mapQuestionToUI(question);

      return questionDetail;
    } else {
      return undefined;
    }
  }
);

export const selectDisplayTimer = createSelector(
  selectTimer,
  selectIsTimerActive,
  selectTotal,
  (
    remainingTime: number | undefined,
    isTimerActive: boolean,
    totalQuestions: number
  ): Timer | undefined => {
    if (isTimerActive && remainingTime) {
      const totalTime = totalQuestions * 10;

      const status =
        remainingTime >= totalTime / 2
          ? TimerStatus.START
          : remainingTime < totalTime / 2 && remainingTime > 15
          ? TimerStatus.HALF
          : TimerStatus.END;

      return { remainingTime, status };
    } else {
      return undefined;
    }
  }
);

export const selectQuizViewState = createSelector(
  selectCurrentIndex,
  selectTotal,
  selectScore,
  selectLoaded,
  selectDisplayQuestion,
  selectDisplayTimer,
  selectSelectedMode,
  (
    currentIndex,
    totalQuestions,
    score,
    loaded,
    currentQuestion,
    timer,
    mode
  ): QuizViewState => ({
    content: currentQuestion,
    currentIndex: currentIndex + 1,
    score,
    totalQuestions,
    timer,
    mode,
    loaded,
  })
);

import { ImageOption, Question } from "@angular-quiz/api-interfaces";
import { createSelector } from "@ngrx/store";
import {
  selectCurrentIndex,
  selectTotal,
  selectScore,
  selectLoaded,
  selectTimer,
  selectIsTimerActive,
  selectSelectedMode,
  selectCurrentQuestion,
} from "../quiz.reducer";
import { QuizViewState } from "../models/quiz-view.model";
import { mapImages } from "../utils/quiz.utils";
import { Timer, TimerStatus } from "../models/timer.model";

const selectDisplayQuestion = createSelector(
  selectCurrentQuestion,
  (question: Question) => {
    if (question) {
      const questionDetail = {
        questionId: question.id,
        question: question.question.text,
        answers: [
          ...(typeof question.incorrectAnswers[0] === "string"
            ? question.incorrectAnswers
            : mapImages(question.incorrectAnswers as Array<ImageOption[]>)),
          typeof question.correctAnswer === "string"
            ? question.correctAnswer
            : question.correctAnswer[0],
        ] as string[] | ImageOption[],
        response: question.response,
        correctAnswer:
          typeof question.correctAnswer === "string"
            ? question.correctAnswer
            : question.correctAnswer[0],
        type: question.type,
      };

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

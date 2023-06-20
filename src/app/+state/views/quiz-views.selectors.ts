import { ImageOption, Question } from "@angular-quiz/api-interfaces";
import { createSelector } from "@ngrx/store";
import {
  selectCurrentIndex,
  selectNumberOfQuestions,
  selectScore,
  selectQuizLoaded,
  selectCurrentQuestion,
  selectTimer,
  selectTimerActive,
  selectQuizMode,
} from "../quiz.selectors";
import { QuizViewState } from "../models/quiz-view.model";
import { mapImages } from "../utils/quiz.utils";
import { Timer, TimerStatus } from "../models/timer.model";

const displayQuestion = createSelector(
  selectCurrentQuestion,
  (question: Question) =>
    question
      ? {
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
        }
      : undefined
);

export const displayTimer = createSelector(
  selectTimer,
  selectNumberOfQuestions,
  selectTimerActive,
  (
    time: number | undefined,
    totalQuestions: number,
    isTimerActive: boolean
  ): Timer | undefined => {
    if (isTimerActive && time) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const displayTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

      const totalTime = totalQuestions * 10;

      const status =
        time >= totalTime / 2
          ? TimerStatus.START
          : time < totalTime / 2 && time > 15
          ? TimerStatus.HALF
          : TimerStatus.END;

      return { displayTime, status };
    } else {
      return undefined;
    }
  }
);

export const quizViewState = createSelector(
  selectCurrentIndex,
  selectNumberOfQuestions,
  selectScore,
  selectQuizLoaded,
  displayQuestion,
  displayTimer,
  selectQuizMode,
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

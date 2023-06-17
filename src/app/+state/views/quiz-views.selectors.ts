import { ImageOption, Question } from "@angular-quiz/api-interfaces";
import { createSelector } from "@ngrx/store";
import {
  selectCurrentIndex,
  selectNumberOfQuestions,
  selectScore,
  selectQuizLoaded,
  selectCurrentQuestion,
  selectTimer,
} from "../quiz.selectors";
import { QuizViewState } from "./models/quiz-view.model";
import { ResultStatus, ResultViewState } from "./models/result-view.model";
import { mapImages } from "../utils/quiz.utils";
import { Timer, TimerStatus } from "./models/timer.model";

const displayQuestion = createSelector(
  selectCurrentQuestion,
  (question: Question): QuizViewState["content"] | {} =>
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
          ],
          response: question.response,
          correctAnswer:
            typeof question.correctAnswer === "string"
              ? question.correctAnswer
              : question.correctAnswer[0],
          type: question.type,
        }
      : {}
);

export const displayTimer = createSelector(
  selectTimer,
  selectNumberOfQuestions,
  (time: number, totalQuestions: number): Timer => {
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
  }
);

export const quizViewState = createSelector(
  selectCurrentIndex,
  selectNumberOfQuestions,
  selectScore,
  selectQuizLoaded,
  selectCurrentQuestion,
  displayQuestion,
  displayTimer,
  (
    currentIndex: number,
    totalQuestions: number,
    score: number,
    loaded: boolean,
    currentQuestion: Question,
    question: any,
    timer: any
  ): QuizViewState => ({
    content: currentQuestion ? question : {},
    currentIndex: currentIndex + 1,
    score,
    totalQuestions,
    timer,
    loaded,
  })
);

export const resultViewState = createSelector(
  selectScore,
  selectNumberOfQuestions,
  (score: number, totalQuestions: number): ResultViewState => {
    const percentage = (score / totalQuestions) * 100;
    const status =
      percentage >= 90
        ? ResultStatus.EXCELLENT
        : percentage >= 80 && percentage < 90
        ? ResultStatus.GOOD
        : percentage >= 60 && percentage < 80
        ? ResultStatus.AVERAGE
        : ResultStatus.FAIL;

    return { score, totalQuestions, status };
  }
);

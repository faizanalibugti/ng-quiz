import {
  ImageOption,
  Question,
  QuestionType,
  TriviaCategories,
  TriviaOptions,
} from "@angular-quiz/api-interfaces";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { quizAdapter, quizFeatureKey, State } from "./quiz.reducer";

export interface QuizViewState {
  id: string;
  content: {
    question: string;
    answers: string[];
    response: string | ImageOption | undefined;
    correctAnswer: string;
    type: QuestionType;
  };
  score: number;
  loaded: boolean;
  currentIndex: number;
  totalQuestions: number;
  timer: {
    displayTime: string;
    status: string;
  };
}

export const selectQuizState = createFeatureSelector<State>(quizFeatureKey);

export const selectQuizLoaded = createSelector(
  selectQuizState,
  (state: State) => state.loaded
);

export const selectTriviaCategories = createSelector(
  selectQuizState,
  (state: State) => state.categories as TriviaCategories
);

export const selectTriviaOptions = createSelector(
  selectQuizState,
  (state: State) => state.triviaOptions as TriviaOptions
);

const { selectAll } = quizAdapter.getSelectors();

export const selectQuizQuestions = createSelector(
  selectQuizState,
  (state: State) => selectAll(state) as Question[]
);

export const selectNumberOfQuestions = createSelector(
  selectQuizQuestions,
  (questions: Question[]) => questions.length as number
);

export const selectCurrentIndex = createSelector(
  selectQuizState,
  (state: State) => state.currentIndex as number
);

export const selectScore = createSelector(
  selectQuizState,
  (state: State) => state.score as number
);

export const displayResult = createSelector(
  selectScore,
  selectNumberOfQuestions,
  (score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    const status =
      percentage >= 90
        ? "Excellent"
        : score >= 80 && score < 90
        ? "Good"
        : score >= 60 && score < 80
        ? "Average"
        : "Fail";

    return { score, totalQuestions, status }
  }
);

export const selectCurrentQuestion = createSelector(
  selectCurrentIndex,
  selectQuizQuestions,
  (currentIndex: number, question: Question[]) =>
    question[currentIndex] as Question
);

export const displayQuestion = createSelector(
  selectCurrentQuestion,
  (question: Question) =>
    question
      ? {
          question: question.question.text,
          answers: [
            ...(typeof question.incorrectAnswers[0] === "string"
              ? question.incorrectAnswers
              : mapImages(question.incorrectAnswers as any)),
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

export const selectTimer = createSelector(
  selectQuizState,
  (state: State) => state.timer || 0
);

export const displayTimer = createSelector(
  selectTimer,
  selectNumberOfQuestions,
  (time: number, totalQuestions: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const displayTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    const totalTime = totalQuestions * 10;

    const status =
      time > totalTime / 2
        ? "start"
        : time < totalTime / 2 && time > 15
        ? "half"
        : "end";

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
  ) =>
    ({
      id: currentQuestion?.id,
      content: currentQuestion ? question : {},
      currentIndex: currentIndex + 1,
      score,
      totalQuestions,
      timer,
      loaded,
    } as QuizViewState)
);

function mapImages(incorrectAnswers: any) {
  return [...incorrectAnswers].map((option) => {
    return option[0];
  });
}

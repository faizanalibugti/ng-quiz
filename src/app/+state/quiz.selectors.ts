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

export const selectCurrentQuestion = createSelector(
  selectCurrentIndex,
  selectQuizQuestions,
  (currentIndex: number, question: Question[]) =>
    question[currentIndex] as Question
);

export const quizViewState = createSelector(
  selectCurrentIndex,
  selectNumberOfQuestions,
  selectScore,
  selectQuizLoaded,
  selectCurrentQuestion,
  (
    currentIndex: number,
    totalQuestions: number,
    score: number,
    loaded: boolean,
    question: Question
  ) =>
    ({
      id: question?.id,
      content: question
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
        : {},
      currentIndex: currentIndex + 1,
      score,
      totalQuestions,
      loaded,
    } as QuizViewState)
);

function mapImages(incorrectAnswers: any) {
  return [...incorrectAnswers].map((option) => {
    return option[0];
  });
}

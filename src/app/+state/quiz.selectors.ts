import {
  ImageOption,
  Question,
  TriviaCategories,
  TriviaQueryParams,
} from "@angular-quiz/api-interfaces";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State, quizAdapter, quizFeatureKey } from "./quiz.reducer";
import { mapImages } from "./utils/quiz.utils";

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
  (state: State) => state.triviaOptions as TriviaQueryParams
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

export const selectTimerActive = createSelector(
  selectQuizState,
  (state: State) => state.isTimerActive as boolean
);

export const selectTimer = createSelector(
  selectQuizState,
  selectTimerActive,
  (state: State, isTimerActive: boolean) =>
    isTimerActive ? state.timer || 0 : undefined
);

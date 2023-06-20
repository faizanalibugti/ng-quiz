import {
  ImageOption,
  Question,
  TriviaCategories,
  TriviaQueryParams,
} from "@angular-quiz/api-interfaces";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { QuizState, quizAdapter, quizFeatureKey } from "./quiz.reducer";
import { mapImages } from "./utils/quiz.utils";
import { QuizMode } from "./models/quiz-mode.model";

export const selectQuizState = createFeatureSelector<QuizState>(quizFeatureKey);

export const selectQuizLoaded = createSelector(
  selectQuizState,
  (state: QuizState) => state.loaded
);

export const selectTriviaCategories = createSelector(
  selectQuizState,
  (state: QuizState) => state.categories as TriviaCategories
);

export const selectTriviaOptions = createSelector(
  selectQuizState,
  (state: QuizState) => state.triviaOptions as TriviaQueryParams
);

const { selectAll } = quizAdapter.getSelectors();

export const selectQuizQuestions = createSelector(
  selectQuizState,
  (state: QuizState) => selectAll(state) as Question[]
);

export const selectNumberOfQuestions = createSelector(
  selectQuizQuestions,
  (questions: Question[]) => questions.length as number
);

export const selectCurrentIndex = createSelector(
  selectQuizState,
  (state: QuizState) => state.currentIndex as number
);

export const selectScore = createSelector(
  selectQuizState,
  (state: QuizState) => state.score as number
);

export const selectCurrentQuestion = createSelector(
  selectCurrentIndex,
  selectQuizQuestions,
  (currentIndex: number, question: Question[]) =>
    question[currentIndex] as Question
);

export const selectTimerActive = createSelector(
  selectQuizState,
  (state: QuizState) => state.isTimerActive as boolean
);

export const selectTimer = createSelector(
  selectQuizState,
  selectTimerActive,
  (state: QuizState, isTimerActive: boolean) =>
    isTimerActive ? state.timer || 0 : undefined
);

export const selectUsername = createSelector(
  selectQuizState,
  (state: QuizState) => state.username?.split(" ")[0]
);

export const selectDifficulties = createSelector(
  selectQuizState,
  (state: QuizState) => state.difficulties
);

export const selectModes = createSelector(
  selectQuizState,
  (state: QuizState) => state.modes
);

export const selectQuizMode = createSelector(
  selectQuizState,
  (state: QuizState) => state.selectedMode as QuizMode
);

export const selectQuestionTypes = createSelector(
  selectQuizState,
  (state: QuizState) => state.questionTypes
);

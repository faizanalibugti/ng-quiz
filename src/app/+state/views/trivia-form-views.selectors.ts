import { createSelector } from "@ngrx/store";
import {
  selectDifficulties,
  selectModes,
  selectQuestionTypes,
  selectTriviaCategories,
} from "../quiz.selectors";
import { TriviaFormViewState } from "../models/trivia-form-view.model";

export const triviaFormViewState = createSelector(
  selectTriviaCategories,
  selectDifficulties,
  selectQuestionTypes,
  selectModes,
  (categories, difficulties, questionTypes, modes): TriviaFormViewState => ({
    categories,
    difficulties,
    questionTypes,
    modes,
  })
);

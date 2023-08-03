import { createSelector } from "@ngrx/store";

import { TriviaFormViewState } from "../models/trivia-form-view.model";
import {
  selectDifficulties,
  selectModes,
  selectQuestionTypes,
  selectCategories,
} from "../quiz.reducer";

export const selectTriviaFormViewState = createSelector(
  selectCategories,
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

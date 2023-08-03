import { createSelector } from "@ngrx/store";
import { ResultViewState, ResultStatus } from "../models/result-view.model";
import { selectScore, selectTotal, selectUsername } from "../quiz.reducer";

export const selectResultViewState = createSelector(
  selectScore,
  selectTotal,
  selectUsername,
  (score, totalQuestions, username): ResultViewState => {
    const percentage = (score / totalQuestions) * 100;
    const status =
      percentage >= 90
        ? ResultStatus.EXCELLENT
        : percentage >= 80 && percentage < 90
        ? ResultStatus.GOOD
        : percentage >= 60 && percentage < 80
        ? ResultStatus.AVERAGE
        : ResultStatus.FAIL;

    return { score, totalQuestions, status, username };
  }
);

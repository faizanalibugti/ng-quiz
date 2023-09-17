import { createSelector } from '@ngrx/store';
import { ResultViewState, ResultStatus } from '../models/result-view.model';
import {
  selectScore,
  selectTotal,
  selectUsername,
  selectAll,
} from '../quiz.reducer';
import { mapQuestionToUI } from '../utils/quiz.utils';

export const selectResultViewState = createSelector(
  selectScore,
  selectTotal,
  selectUsername,
  selectAll,
  (score, totalQuestions, username, questions): ResultViewState => {
    const percentage = (score / totalQuestions) * 100;
    const status =
      percentage >= 90
        ? ResultStatus.EXCELLENT
        : percentage >= 80 && percentage < 90
        ? ResultStatus.GOOD
        : percentage >= 60 && percentage < 80
        ? ResultStatus.AVERAGE
        : ResultStatus.FAIL;

    const UIQuestionItems = questions.map((question) =>
      mapQuestionToUI(question)
    );

    return {
      score,
      totalQuestions,
      status,
      username,
      questions: UIQuestionItems,
    };
  }
);

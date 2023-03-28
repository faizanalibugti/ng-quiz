import * as fromQuiz from './quiz.reducer';
import { selectQuizState } from './quiz.selectors';

describe('Quiz Selectors', () => {
  it('should select the feature state', () => {
    const result = selectQuizState({
      [fromQuiz.quizFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

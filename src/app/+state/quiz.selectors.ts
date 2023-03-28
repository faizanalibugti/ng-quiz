import { Question, TriviaCategories, TriviaOptions } from '@angular-quiz/api-interfaces';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { quizAdapter, quizFeatureKey, State } from './quiz.reducer';

export interface QuizViewState {
  id: string;
  content: {
    question: string;
    answers: string[];
    response: string | undefined;
    correctAnswer: string;
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
            question: question.question,
            answers: [...question.incorrectAnswers, question.correctAnswer],
            response: question.response,
            correctAnswer: question.correctAnswer,
          }
        : {},
      currentIndex: currentIndex + 1,
      score,
      totalQuestions,
      loaded,
    } as QuizViewState)
);

const shuffleAnswers = (() => {
  let closureCorrectAnswer: string;
  return (incorrectAnswers: string[], correctAnswer: string) => {
    if (correctAnswer !== closureCorrectAnswer)
      closureCorrectAnswer = correctAnswer;
    return [...incorrectAnswers, correctAnswer]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };
})();

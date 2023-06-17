import {
  Question,
  TriviaCategories,
  TriviaQueryParams,
} from "@angular-quiz/api-interfaces";
import { createEntityAdapter } from "@ngrx/entity";
import { EntityAdapter, EntityState } from "@ngrx/entity/src";
import { createReducer, on } from "@ngrx/store";
import * as QuizActions from "./quiz.actions";
import { QuizMode } from "./views/models/quiz-mode.model";

export const quizFeatureKey = "quiz";

export interface State extends EntityState<Question> {
  selectedId?: string | number; // which Quiz record has been selected
  loaded: boolean; // has the Quiz list been loaded
  error?: string | null; // last known error (if any)
  currentIndex: number;
  score: number;
  categories?: TriviaCategories;
  triviaOptions?: TriviaQueryParams;
  timer?: number;
  isTimerActive?: boolean;
  username?: string;
}

export const quizAdapter: EntityAdapter<Question> =
  createEntityAdapter<Question>();

export const initialState: State = quizAdapter.getInitialState({
  loaded: false,
  currentIndex: 0,
  score: 0,
});

export const reducer = createReducer(
  initialState,
  on(QuizActions.quizApiActions.loadCategoriesSuccess, (state, { data }) => ({
    ...state,
    categories: data,
  })),
  on(QuizActions.quizActions.loadQuiz, (state, { options, mode, name }) => ({
    ...state,
    username: name,
    triviaOptions: options,
    isTimerActive: mode === QuizMode.TRIVIA_CHALLENGE,
    loaded: false,
  })),
  on(QuizActions.quizApiActions.loadQuizSuccess, (state, { data }) =>
    quizAdapter.setAll(data, {
      ...state,
      loaded: true,
      currentIndex: 0,
      score: 0,
    })
  ),
  on(
    QuizActions.quizApiActions.loadQuizFailure,
    QuizActions.quizApiActions.loadCategoriesFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  ),
  on(QuizActions.quizActions.updateTimer, (state, { remainingTime }) => ({
    ...state,
    timer: remainingTime,
  })),
  on(
    QuizActions.quizActions.answerQuestion,
    (state, { questionId, response }) =>
      quizAdapter.updateOne(
        {
          id: questionId,
          changes: { ...state.entities[questionId], response },
        },
        {
          ...state,
          score:
            (typeof state.entities[questionId]?.correctAnswer === "string"
              ? state.entities[questionId]?.correctAnswer
              : state.entities[questionId]?.correctAnswer[0]) === response
              ? state.score + 1
              : state.score,
        }
      )
  ),
  on(
    QuizActions.quizActions.nextQuestion,
    QuizActions.quizActions.skipQuestion,
    (state) => ({
      ...state,
      // currentIndex: state.ids[state.currentIndex + 1]
      //   ? state.currentIndex + 1
      //   : state.currentIndex,
      currentIndex: state.currentIndex + 1,
    })
  )
);

import {
  Question,
  QuestionDifficulty,
  QuestionType,
  TriviaCategories,
  TriviaQueryParams,
} from "@angular-quiz/api-interfaces";
import { createEntityAdapter } from "@ngrx/entity";
import { EntityAdapter, EntityState } from "@ngrx/entity/src";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { QuizMode } from "./models/quiz-mode.model";
import * as QuizActions from "./quiz.actions";

export const quizFeatureKey = "quiz";

export interface QuizState extends EntityState<Question> {
  selectedId: string | number | null; // which Quiz record has been selected
  loaded: boolean; // has the Quiz list been loaded
  error: string | null; // last known error (if any)
  currentIndex: number;
  score: number;
  categories: TriviaCategories | undefined;
  triviaOptions: TriviaQueryParams | undefined;
  timer: number;
  isTimerActive: boolean;
  username: string | undefined;
  difficulties: QuestionDifficulty[];
  questionTypes: { [key: string]: QuestionType };
  modes: { type: QuizMode; toolTip: string }[];
  selectedMode: QuizMode | undefined;
}

export const quizAdapter: EntityAdapter<Question> =
  createEntityAdapter<Question>();

export const initialState: QuizState = quizAdapter.getInitialState({
  loaded: false,
  currentIndex: 0,
  score: 0,
  difficulties: [
    QuestionDifficulty.EASY,
    QuestionDifficulty.MEDIUM,
    QuestionDifficulty.HARD,
  ],
  questionTypes: {
    "Text Choice": QuestionType.TEXT_CHOICE,
    "Image Choice": QuestionType.IMAGE_CHOICE,
  },
  modes: [
    {
      type: QuizMode.PRACTICE,
      toolTip: "An un-timed learning mode to practice your trivia skills",
    },
    {
      type: QuizMode.TRIVIA_CHALLENGE,
      toolTip: "A timed challenge to put your trivia skills to the test",
    },
  ],
  categories: undefined,
  error: null,
  isTimerActive: false,
  selectedMode: undefined,
  selectedId: null,
  timer: 0,
  triviaOptions: undefined,
  username: undefined,
});

export const reducer = createReducer(
  initialState,
  on(
    QuizActions.quizApiActions.loadCategoriesSuccess,
    (state, { data }): QuizState => ({
      ...state,
      categories: data,
    })
  ),
  on(
    QuizActions.quizActions.loadQuiz,
    (state, { options, mode, name }): QuizState => ({
      ...state,
      username: name,
      triviaOptions: options,
      isTimerActive: mode === QuizMode.TRIVIA_CHALLENGE,
      selectedMode: mode,
      loaded: false,
    })
  ),
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
    (state, { error }): QuizState => ({
      ...state,
      error,
    })
  ),
  on(
    QuizActions.quizActions.updateTimer,
    (state, { remainingTime }): QuizState => ({
      ...state,
      timer: remainingTime,
    })
  ),
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
    (state): QuizState => ({
      ...state,
      // currentIndex: state.ids[state.currentIndex + 1]
      //   ? state.currentIndex + 1
      //   : state.currentIndex,
      currentIndex: state.currentIndex + 1,
    })
  )
);

// eslint-disable-next-line @ngrx/prefix-selectors-with-select
export const quizFeature = createFeature({
  name: "quiz",
  reducer,
  extraSelectors: ({
    selectQuizState,
    selectIds,
    selectEntities,
    selectCurrentIndex,
  }) => ({
    ...quizAdapter.getSelectors(selectQuizState),
    selectCurrentQuestion: createSelector(
      selectIds,
      selectEntities,
      selectCurrentIndex,
      (ids, questions, currentIndex) => questions[ids[currentIndex]] as Question
    ),
  }),
});

export const {
  selectCategories,
  selectDifficulties,
  selectEntities,
  selectCurrentIndex,
  selectError,
  selectIds,
  selectIsTimerActive,
  selectLoaded,
  selectModes,
  selectQuestionTypes,
  selectQuizState,
  selectScore,
  selectSelectedId,
  selectSelectedMode,
  selectTimer,
  selectTriviaOptions,
  selectUsername,
  selectAll,
  selectTotal,
  selectCurrentQuestion,
} = quizFeature;
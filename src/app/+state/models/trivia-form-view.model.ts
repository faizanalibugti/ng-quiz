import {
  TriviaCategories,
  QuestionDifficulty,
  QuestionType,
} from "@angular-quiz/api-interfaces";
import { QuizMode } from "./quiz-mode.model";

export interface TriviaFormViewState {
  categories: TriviaCategories;
  difficulties: QuestionDifficulty[];
  questionTypes: {
    [key: string]: QuestionType;
  };
  modes: {
    type: QuizMode;
    toolTip: string;
  }[];
}

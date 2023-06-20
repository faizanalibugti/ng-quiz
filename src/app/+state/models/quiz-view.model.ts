import { ImageOption, QuestionType } from "@angular-quiz/api-interfaces";
import { Timer } from "./timer.model";
import { QuizMode } from "./quiz-mode.model";

export interface QuizViewState {
  content?: {
    questionId: string;
    question: string;
    answers: string[] | ImageOption[];
    response: string | ImageOption | undefined;
    correctAnswer: string | ImageOption;
    type: QuestionType;
  };
  score: number;
  loaded: boolean;
  currentIndex: number;
  totalQuestions: number;
  timer: Timer | undefined;
  mode: QuizMode
}

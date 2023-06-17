import { ImageOption, QuestionType } from "@angular-quiz/api-interfaces";
import { Timer } from "./timer.model";

export interface QuizViewState {
  content: {
    questionId: string;
    question: string;
    answers: string[];
    response: string | ImageOption | undefined;
    correctAnswer: string;
    type: QuestionType;
  };
  score: number;
  loaded: boolean;
  currentIndex: number;
  totalQuestions: number;
  timer: Timer;
}

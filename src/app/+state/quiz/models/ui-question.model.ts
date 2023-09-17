import { ImageOption, QuestionType } from '@angular-quiz/api-interfaces';

export interface UIQuestion {
  questionId: string;
  question: string;
  answers: string[] | ImageOption[];
  response: string | ImageOption | undefined;
  correctAnswer: string | ImageOption;
  type: QuestionType;
}

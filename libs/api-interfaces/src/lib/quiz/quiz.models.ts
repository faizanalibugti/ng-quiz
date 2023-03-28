export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

enum QuestionType {
  MCQ = 'Multiple Choice',
}

export interface Question {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  tags: string[];
  type: QuestionType;
  difficulty: QuestionDifficulty;
  regions: string[];
  isNiche: boolean;
  response?: string;
}

export interface TriviaCategories {
  [key: string]: string[];
}

export interface TriviaOptions {
  limit: number;
  categories: string;
  difficulty: string;
}

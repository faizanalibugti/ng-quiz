export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum QuestionType {
  TEXT_CHOICE = "text_choice",
  IMAGE_CHOICE = "image_choice",
}

export interface ImageOption {
  url: string;
  height: number;
  width: number;
  size: number;
  author: {
    name: string;
    url: string;
  };
  soure: {
    url: string;
  };
  description: string;
  license: {
    url: string;
    name: string;
  };
}

export interface Question {
  id: string;
  category: string;
  correctAnswer: string | ImageOption[];
  incorrectAnswers: string[] | Array<ImageOption[]>;
  question: {
    text: string;
  };
  tags: string[];
  type: QuestionType;
  difficulty: QuestionDifficulty;
  regions: string[];
  isNiche: boolean;
  response?: string | ImageOption;
}

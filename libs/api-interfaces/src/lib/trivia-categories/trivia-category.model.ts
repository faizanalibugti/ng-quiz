export interface TriviaCategories {
  [key: string]: string[];
}

export interface TriviaQueryParams{
  limit: number;
  categories: string[];
  difficulty: string[];
  types: string[];
}

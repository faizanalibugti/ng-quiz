export interface TriviaCategories {
  [key: string]: string[];
}

export interface TriviaQueryParams {
  limit: number;
  categories: string[];
  difficulties: string;
  types: string[];
}

export enum ResultStatus {
  EXCELLENT = "Excellent",
  GOOD = "Good",
  AVERAGE = "Average",
  FAIL = "Fail",
}

export interface ResultViewState {
  score: number;
  totalQuestions: number;
  status: ResultStatus;
  username: string | undefined;
}

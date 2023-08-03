export enum TimerStatus {
  START = "start",
  HALF = "half",
  END = "end",
}

export interface Timer {
  remainingTime: number;
  status: TimerStatus;
}

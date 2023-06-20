export enum TimerStatus {
  START = "start",
  HALF = "half",
  END = "end",
}

export interface Timer {
  displayTime: string;
  status: TimerStatus;
}

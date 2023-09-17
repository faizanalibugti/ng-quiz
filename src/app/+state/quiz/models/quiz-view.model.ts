import { QuizMode } from './quiz-mode.model';
import { Timer } from './timer.model';
import { UIQuestion } from './ui-question.model';

export interface QuizViewState {
  content?: UIQuestion;
  score: number;
  loaded: boolean;
  currentIndex: number;
  totalQuestions: number;
  timer: Timer | undefined;
  mode?: QuizMode;
}

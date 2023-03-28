import { Question, TriviaCategories, TriviaOptions } from '@angular-quiz/api-interfaces';
import {
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';

export const quizActions = createActionGroup({
  source: 'Quiz',
  events: {
    'Load Categories': emptyProps(),
    'Load Quiz': props<{ options: TriviaOptions }>(),
    'Next Questiom': emptyProps(),
    'Answer Question': props<{ questionId: string; response: string }>(),
  },
});

export const quizApiActions = createActionGroup({
  source: 'Quiz API',
  events: {
    'Load Categories Success': props<{ data: TriviaCategories }>(),
    'Load Categories Failure': props<{ error: any }>(),
    'Load Quiz Success': props<{ data: Question[] }>(),
    'Load Quiz Failure': props<{ error: any }>(),
  },
});

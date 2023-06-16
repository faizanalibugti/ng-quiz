import {
  ImageOption,
  Question,
  TriviaCategories,
  TriviaOptions,
} from "@angular-quiz/api-interfaces";
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const quizActions = createActionGroup({
  source: "Quiz",
  events: {
    "Load Categories": emptyProps(),
    "Load Quiz": props<{ options: TriviaOptions }>(),
    "Update Timer": props<{ remainingTime: number }>(),
    "Times Up": emptyProps(),
    "Next Question": emptyProps(),
    "Skip Question": emptyProps(),
    "Answer Question": props<{
      questionId: string;
      response: string | ImageOption;
    }>(),
  },
});

export const quizApiActions = createActionGroup({
  source: "Quiz API",
  events: {
    "Load Categories Success": props<{ data: TriviaCategories }>(),
    "Load Categories Failure": props<{ error: any }>(),
    "Load Quiz Success": props<{ data: Question[] }>(),
    "Load Quiz Failure": props<{ error: any }>(),
  },
});

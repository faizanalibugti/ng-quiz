import { Route } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { TriviaFormComponent } from './trivia-form/trivia-form.component';

export const appRoutes: Route[] = [
  { path: '', component: TriviaFormComponent },
  {
    path: 'quiz',
    component: QuestionComponent,
  },
];

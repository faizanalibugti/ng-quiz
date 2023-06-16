import { Route } from "@angular/router";
import { QuestionComponent } from "./question/question.component";
import { TriviaFormComponent } from "./trivia-form/trivia-form.component";
import { ResultsComponent } from "./results/results.component";

export const appRoutes: Route[] = [
  { path: "home", component: TriviaFormComponent },
  {
    path: "quiz",
    component: QuestionComponent,
  },
  {
    path: 'result',
    component: ResultsComponent
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

import { Route } from "@angular/router";
import { TriviaFormComponent } from "./trivia-form/trivia-form.component";
import { ResultsComponent } from "./results/results.component";
import { QuizComponent } from "./quiz/quiz.component";

export const appRoutes: Route[] = [
  { path: "home", component: TriviaFormComponent, title: "Trivia Quiz - Home" },
  {
    path: "quiz",
    component: QuizComponent,
    title: "Trivia Quiz", 
  },
  {
    path: "result",
    component: ResultsComponent,
    title: "Results",
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

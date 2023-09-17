import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreDataModule, TimerPipe } from '@angular-quiz/core-data';
import { MaterialModule } from '@angular-quiz/material';
import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterState,
  StoreRouterConnectingModule,
  routerReducer,
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { QuizEffects } from './+state/quiz/quiz.effects';
import * as fromQuiz from './+state/quiz/quiz.reducer';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AnswerOptionsComponent } from './quiz/answer-options/answer-options.component';
import { QuizInfoComponent } from './quiz/quiz-info/quiz-info.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultsComponent } from './results/results.component';
import { TriviaFormComponent } from './trivia-form/trivia-form.component';
import { environment } from '../environments/environment.development';
@NgModule({
  declarations: [
    AppComponent,
    TriviaFormComponent,
    ResultsComponent,
    QuizComponent,
    QuizInfoComponent,
    AnswerOptionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabledBlocking',
    }),
    CoreDataModule,
    MaterialModule,
    StoreModule.forRoot(
      {
        router: routerReducer,
      },
      {
        metaReducers: [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
    }),
    // Instrumentation must be imported after importing StoreModule
    ...environment.imports,
    StoreModule.forFeature(fromQuiz.quizFeature),
    EffectsModule.forFeature([QuizEffects]),
  ],
  providers: [TimerPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}

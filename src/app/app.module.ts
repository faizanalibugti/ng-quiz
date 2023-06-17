import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromQuiz from './+state/quiz.reducer';
import { QuizEffects } from './+state/quiz.effects';
import { CoreDataModule } from '@angular-quiz/core-data';
import { MaterialModule } from '@angular-quiz/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TriviaFormComponent } from './trivia-form/trivia-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResultsComponent } from './results/results.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizInfoComponent } from './quiz/quiz-info/quiz-info.component';
import { AnswerOptionsComponent } from './quiz/answer-options/answer-options.component';

@NgModule({
  declarations: [AppComponent, TriviaFormComponent, ResultsComponent, QuizComponent, QuizInfoComponent, AnswerOptionsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    CoreDataModule,
    MaterialModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({}),
    StoreModule.forFeature(fromQuiz.quizFeatureKey, fromQuiz.reducer),
    EffectsModule.forFeature([QuizEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

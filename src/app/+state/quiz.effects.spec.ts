import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { Observable } from "rxjs";

import { TimerPipe } from "@angular-quiz/core-data";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { Action } from "@ngrx/store";
import { QuizEffects } from "./quiz.effects";

describe("QuizEffects", () => {
  let actions$: Observable<Action>;
  let effects: QuizEffects;
  let store: MockStore;
  // TODO: Mock the QuizHttp & Notification Service instead
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let snackbar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        QuizEffects,
        provideMockActions(() => actions$),
        provideMockStore({}),
        MatSnackBar,
        TimerPipe,
      ],
    });

    effects = TestBed.inject(QuizEffects);
    store = TestBed.inject(MockStore);
    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    snackbar = TestBed.inject(MatSnackBar);
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});

import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable } from "rxjs";

import { QuizEffects } from "./quiz.effects";
import { Action } from "@ngrx/store";

describe("QuizEffects", () => {
  let actions$: Observable<Action>;
  let effects: QuizEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(QuizEffects);
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});

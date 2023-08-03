import { TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

import { QuizPageService } from "./quiz-page.service";

describe("QuizPageService", () => {
  let service: QuizPageService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    store = TestBed.inject(MockStore);
    service = TestBed.inject(QuizPageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { QuizHttpService } from './quiz-http.service';

describe('QuizHttpService', () => {
  let service: QuizHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

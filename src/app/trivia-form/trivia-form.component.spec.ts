import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TriviaFormComponent } from "./trivia-form.component";

describe("TriviaFormComponent", () => {
  let component: TriviaFormComponent;
  let fixture: ComponentFixture<TriviaFormComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriviaFormComponent],
      providers: [provideMockStore()]
    }).compileComponents();

    fixture = TestBed.createComponent(TriviaFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

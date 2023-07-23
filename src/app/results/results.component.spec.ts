import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ResultsComponent } from "./results.component";

describe("ResultsComponent", () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      providers: [provideMockStore()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore)
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

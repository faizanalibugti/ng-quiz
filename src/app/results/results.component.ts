import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { displayResult } from "../+state/quiz.selectors";

@Component({
  selector: "angular-quiz-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
})
export class ResultsComponent implements OnInit {
  result$!: Observable<any>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.result$ = this.store.pipe(select(displayResult));
  }
}

import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { ResultViewState } from "../+state/models/result-view.model";
import { resultViewState } from "../+state/views/result-views.selectors";

@Component({
  selector: "angular-quiz-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
})
export class ResultsComponent implements OnInit {
  result$!: Observable<ResultViewState>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.result$ = this.store.pipe(select(resultViewState));
  }
}

import { Component, OnInit, inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { ResultViewState } from "../+state/models/result-view.model";
import { resultViewState } from "../+state/views/result-views.selectors";
import { ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "angular-quiz-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent implements OnInit {
  private readonly store = inject(Store);

  result$!: Observable<ResultViewState>;

  ngOnInit(): void {
    this.result$ = this.store.pipe(select(resultViewState));
  }
}

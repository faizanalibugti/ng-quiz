import {
  Question,
  QuestionDifficulty,
  QuestionType,
  TriviaCategories,
  TriviaQueryParams,
} from "@angular-quiz/api-interfaces";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timer } from "rxjs";
import { retry } from "rxjs/operators";
import { endpoints } from "../endpoints/endpoints";

@Injectable({
  providedIn: "root",
})
export class QuizHttpService {
  model = "questions";
  API_ENDPOINT = endpoints.apiEndpoint;

  constructor(private http: HttpClient) {}

  private get baseUrl(): string {
    return `${this.API_ENDPOINT}/${this.model}`;
  }

  getCategories(): Observable<TriviaCategories> {
    return this.http
      .request<TriviaCategories>("GET", `${this.API_ENDPOINT}/categories`)
      .pipe(
        retry({
          count: 3,
          delay: (error, retryCount) => timer(500 * retryCount ** 2),
        })
      );
  }

  getQuestions(data?: TriviaQueryParams): Observable<Question[]> {
    let url = `${this.baseUrl}?`;
    console.log(data);

    if (data) {
      Object.keys(data).forEach((key, index) => {
        if (index !== 0 && data[key as keyof TriviaQueryParams].toString()) {
          url += `&`;
        }

        if (key === "categories" && data[key].toString()) {
          if (typeof data[key].toString() !== "string") {
            throw Error("categories must be a string");
          } else {
            url += `categories=${data["categories"].toString()}`;
          }
        } else if (key === "types" && data[key].toString()) {
          if (
            data[key].includes(
              QuestionType.IMAGE_CHOICE || QuestionType.TEXT_CHOICE
            )
          ) {
            url += `types=${data["types"].toString()}`;
          } else {
            throw Error("types must either be image_choice or text_choice");
          }
        } else if (key === "limit" && data[key]) {
          if (isNaN(+data[key])) {
            throw Error("limit must be a number");
          } else {
            url += `limit=${data["limit"]}`;
          }
        } else if (key === "difficulties" && data[key].toString()) {
          if (
            data[key].includes(
              QuestionDifficulty.EASY ||
                QuestionDifficulty.MEDIUM ||
                QuestionDifficulty.HARD
            )
          ) {
            url += `difficulties=${data["difficulties"].toString()}`;
          } else {
            throw Error("difficulty must be a either easy, medium or hard");
          }
        }
      });
    }

    return this.http.request<Question[]>(`GET`, url).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => timer(500 * retryCount ** 2),
      })
    );
  }
}

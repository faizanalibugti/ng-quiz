import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../endpoints/endpoints';
import { Question, QuestionDifficulty, TriviaCategories } from '@angular-quiz/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  model = 'questions';
  API_ENDPOINT = endpoints.apiEndpoint;

  constructor(private http: HttpClient) {}

  private get baseUrl(): string {
    return `${this.API_ENDPOINT}/${this.model}/`;
  }

  getCategories(): Observable<TriviaCategories> {
    return this.http.request<TriviaCategories>(
      'GET',
      `${this.API_ENDPOINT}/categories`
    );
  }

  getQuestions(data?: any): Observable<Question[]> {
    let url = `${this.baseUrl}/?`;
    console.log(data)

    if (data) {
      Object.keys(data).forEach((key, index) => {
        if (index !== 0) {
          url += `&`;
        }
        
        if (key === 'categories') {
          if (typeof data[key] !== 'string') {
            throw Error('categories must be a string');
          } else {
            url += `categories=${data['categories']}`;
          }
        } else if (key === 'limit') {
          if (isNaN(+data[key])) {
            throw Error('limit must be a number');
          } else {
            url += `limit=${data['limit']}`;
          }
        } else if (key === 'difficulty') {
          if (Object.values(QuestionDifficulty).includes(data[key])) {
            url += `difficulty=${data['difficulty']}`;
          } else {
            throw Error('difficulty must be a either easy, medium or hard');
          }
        }
      });
    }

    return this.http.request<Question[]>(`GET`, url);
  }
}

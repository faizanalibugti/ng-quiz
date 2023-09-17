import {
  ImageOption,
  Question,
  TriviaCategories,
} from '@angular-quiz/api-interfaces';
import { UIQuestion } from '../models/ui-question.model';

export const formatTriviaCategories = (
  categrories: TriviaCategories
): TriviaCategories => {
  const triviaCategories: TriviaCategories = {};

  for (const key in categrories) {
    const categoryValue = categrories[key].filter((value, index, array) =>
      array.length === 1 ? value : value.includes('_')
    );

    triviaCategories[key] = categoryValue;
  }

  return triviaCategories;
};

export const mapImages = (
  incorrectImageOptions: Array<ImageOption[]>
): ImageOption[] => {
  return incorrectImageOptions.map((images) =>
    images.reduce((acc, curr) => (acc.size < curr.size ? acc : curr))
  );
};

export const mapQuestionToUI = (question: Question): UIQuestion => {
  return {
    questionId: question.id,
    question: question.question.text,
    answers: [
      ...(typeof question.incorrectAnswers[0] === 'string'
        ? question.incorrectAnswers
        : mapImages(question.incorrectAnswers as Array<ImageOption[]>)),
      typeof question.correctAnswer === 'string'
        ? question.correctAnswer
        : question.correctAnswer[0],
    ] as string[] | ImageOption[],
    response: question.response,
    correctAnswer:
      typeof question.correctAnswer === 'string'
        ? question.correctAnswer
        : question.correctAnswer[0],
    type: question.type,
  };
};

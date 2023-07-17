import { ImageOption, TriviaCategories } from "@angular-quiz/api-interfaces";

export const formatTriviaCategories = (
  categrories: TriviaCategories
): TriviaCategories => {
  const triviaCategories: TriviaCategories = {};

  for (const key in categrories) {
    let categoryValue = categrories[key].filter((value, index, array) =>
      array.length === 1 ? value : value.includes("_")
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
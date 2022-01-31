import * as faceapi from "face-api.js";

export namespace Emotions {
  export const getMostProbableEmotion = (
    expressions: faceapi.FaceExpressions
  ): string => {
    let maxProbability = -Infinity;
    let probableEmotion: string;

    // convert expressions object to array
    const expressionsArray = expressions.asSortedArray();

    // loop over each expression and replace current max with new max
    expressionsArray.forEach((expression) => {
      const { expression: emotion, probability } = expression;

      if (probability > maxProbability) {
        maxProbability = probability;
        probableEmotion = emotion;
      }
    });

    return probableEmotion!;
  };
}

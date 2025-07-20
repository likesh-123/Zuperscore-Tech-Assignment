import { Response } from "express";
import BaseResponse from "../../../utils/responses";
import { readData } from "../../../database/storage";
import AuthenticatedRequest from "../../../utils/helpers/authenticated-request";
const { v4: uuidv4 } = require("uuid");
import { submitSchema } from "../../../validator/quiz-validator";

export const submitQuiz = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const parsed = submitSchema.safeParse(req.body);
    if (!parsed.success) {
      return BaseResponse.validationError(
        res,
        "Validation Error",
        parsed.error.errors
      );
    }

    const { quizId, answers } = parsed.data;
    const quizAnswersData = readData(`quiz_${quizId}`);
    const totalQuestions = Object.keys(quizAnswersData).length;

    if (answers.length !== quizAnswersData.length)
      return BaseResponse.validationError(res, "Invalid number of answers");

    // Using userId from the token instead from request body
    const studentId = req.token.userId;

    const correctAnswers = answers.filter(
      (q: any) => quizAnswersData[q.questionId] === q.selectedOptionId
    );

    const score = correctAnswers.length;

    const percentage = (score / totalQuestions) * 100;
    const feedback =
      percentage >= 80
        ? "Great job!"
        : percentage >= 50
          ? "Keep practicing!"
          : "Needs improvement.";

    return BaseResponse.success(res, "Success", {
      submissionId: uuidv4(),
      score,
      totalQuestions,
      percentage,
      feedback,
    });
  } catch (err: any) {
    return BaseResponse.internalServerError(res, err, err.message);
  }
};

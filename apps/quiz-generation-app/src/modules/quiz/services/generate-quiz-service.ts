import { Response } from "express";
import BaseResponse from "../../../utils/responses";
import { readData, writeData } from "../../../database/storage";
import AuthenticatedRequest from "../../../utils/helpers/authenticated-request";
import { getRandomQuestions } from "../../../utils/helpers/get-random-questions";
const { v4: uuidv4 } = require("uuid");
import { quizSchema } from "../../../validator/quiz-validator";

const questionPool = readData("questions");

export const generateQuiz = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const parsed = quizSchema.safeParse(req.body);
    if (!parsed.success) {
      return BaseResponse.validationError(
        res,
        "Validation Error",
        parsed.error.errors
      );
    }

    const { learningObjectiveId, difficultyLevel, numberOfQuestions } =
      parsed.data;

    const pool = questionPool.filter(
      (q) =>
        q.learningObjectiveId === learningObjectiveId &&
        q.difficulty === difficultyLevel
    );

    if (pool.length < numberOfQuestions) {
      return BaseResponse.validationError(
        res,
        "Not enough questions available."
      );
    }

    const result = await getRandomQuestions(pool, numberOfQuestions);

    const quizAnswers = result.reduce((acc, q) => {
      acc[q.id] = q.correctOptionId;
      return acc;
    }, {});

    const updatedQuestions = result.map((q) => ({
      questionId: q.id,
      text: q.text,
      options: q.options,
    }));

    const quizId = uuidv4();

    writeData(`quiz_${quizId}`, quizAnswers);

    return res.status(200).json({
      quizId,
      questions: updatedQuestions,
    });
  } catch (err: any) {
    return BaseResponse.internalServerError(res, err, err.message);
  }
};

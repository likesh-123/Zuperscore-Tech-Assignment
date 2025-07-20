import { Router } from "express";
import asyncHandler from "../utils/helpers/async-handler";
import { generateQuiz } from "../modules/quiz/services/generate-quiz-service";
import { submitQuiz } from "../modules/quiz/services/submit-quiz-service";

const userRouter = Router();

userRouter.post("/quizzes/generate", asyncHandler(generateQuiz));
userRouter.post("/quizzes/submit", asyncHandler(submitQuiz));

export default userRouter;

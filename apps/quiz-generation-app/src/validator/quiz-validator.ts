const { z } = require("zod");

export const quizSchema = z.object({
  learningObjectiveId: z.string(),
  difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]),
  numberOfQuestions: z.number().int().min(1).max(10),
});
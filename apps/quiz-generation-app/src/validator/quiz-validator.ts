const { z } = require("zod");

export const quizSchema = z.object({
  learningObjectiveId: z.string(),
  difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]),
  numberOfQuestions: z.number().int().min(1).max(10),
});

export const submitSchema = z.object({
  quizId: z.string(),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        selectedOptionId: z.string(),
      })
    )
    .min(1),
});
import { z } from "zod";

export const LoginPayloadSchema = z.object({
  playerName: z.string().min(1, "Player name is required").max(100),
  passkey: z.string().min(1, "Passkey is required"),
});

export const AdminLoginPayloadSchema = z.object({
  passkey: z.string().min(1, "Admin passkey is required"),
});

export const OptionSchema = z.object({
  a: z.string().min(1),
  b: z.string().min(1),
  c: z.string().min(1),
  d: z.string().min(1),
});

export const AdminQuestionPayloadSchema = z.object({
  qNumber: z.number().int().positive(),
  question: z.string().min(1, "Question text is required"),
  options: OptionSchema,
  correctAnswer: z.enum(["a", "b", "c", "d"]),
});

export const QuestionResponseSchema = z.object({
  qId: z.string(),
  qNumber: z.number(),
  question: z.string(),
  options: OptionSchema,
});

export const QuestionSchema = z.object({
  qId: z.string(),
  qNumber: z.number(),
  question: z.string(),
  options: OptionSchema,
  correctAnswer: z.enum(["a", "b", "c", "d"]),
});

export const SubmitPayloadSchema = z.object({
  playerName: z.string().min(1),
  answers: z.record(z.string(), z.enum(["a", "b", "c", "d"])),
  timeElapsedMs: z.number().min(0),
});

export const SubmitResponseSchema = z.object({
  score: z.number(),
  totalQuestions: z.number(),
  timeElapsedMs: z.number(),
  rank: z.number(),
  totalPlayers: z.number(),
});

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  playerName: z.string(),
  score: z.number(),
  timeElapsedMs: z.number(),
  submittedAt: z.string(),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type AdminLoginPayload = z.infer<typeof AdminLoginPayloadSchema>;
export type Option = z.infer<typeof OptionSchema>;
export type AdminQuestionPayload = z.infer<typeof AdminQuestionPayloadSchema>;
export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type SubmitPayload = z.infer<typeof SubmitPayloadSchema>;
export type SubmitResponse = z.infer<typeof SubmitResponseSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

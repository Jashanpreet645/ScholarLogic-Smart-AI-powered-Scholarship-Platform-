import { z } from "zod";

// ─── Onboarding / Profile ────────────────────────────────
export const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),

  educationLevel: z.string().min(1, "Education level is required"),
  course: z.string().min(1, "Course is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
  gpa: z.string().optional(),
  institution: z.string().optional(),

  state: z.string().min(1, "State is required"),
  category: z.string().min(1, "Category is required"),
  firstGen: z.boolean().default(false),
  disability: z.boolean().default(false),

  incomeBracket: z.string().min(1, "Income bracket is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Application ─────────────────────────────────────────
export const applicationSchema = z.object({
  scholarshipId: z.string().min(1),
  status: z.enum(["SAVED", "APPLIED", "UNDER_REVIEW", "WON", "REJECTED"]).optional(),
  notes: z.string().optional(),
});

// ─── SOP Generation ──────────────────────────────────────
export const sopRequestSchema = z.object({
  scholarshipName: z.string().min(1),
  scholarshipDetails: z.string().optional(),
  instructions: z.string().optional(),
});

// ─── Chat ────────────────────────────────────────────────
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});

// ─── Document Upload ─────────────────────────────────────
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

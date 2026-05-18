import { z } from "zod";

export const registerSchema = {
  body: z.object({
    name: z
      .string()
      .min(3, "Name is too short"),

    email: z
      .string()
      .email("Invalid email"),

    password: z
      .string()
      .min(6, "Password must be at least 6 chars"),
      role: z.enum(["user", "admin"]).optional(),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),

    password: z.string().min(6),
  }),
};

import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firmName: z
    .string()
    .min(3, "Firm name must be at least 3 characters")
    .max(30, "Firm name must be at most 30 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Firm name may only contain lowercase alphanumeric characters or single hyphens, and cannot begin or end with a hyphen"
    ),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

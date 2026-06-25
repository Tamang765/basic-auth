import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const userResponseSchema = userSchema.extend({
  id: z.string(),
});

export type UserDTO = z.infer<typeof userSchema>;

export type UserResponseDTO = z.infer<typeof userResponseSchema>;

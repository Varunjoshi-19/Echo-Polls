import { z } from "zod";

const loginSchema = z.object({
     email: z.string().email("Invalid email"),
     password: z.string().min(6, "Minimum 6 characters")
})

export type LoginFormData = z.infer<typeof loginSchema>;


const signupSchema = z.object({
     username: z
          .string()
          .min(3, "Username must be at least 3 characters"),
     email: z
          .string()
          .email("Please enter a valid email"),
     password: z
          .string()
          .min(6, "Password must be at least 6 characters"),
});


export type SignupFormData = z.infer<typeof signupSchema>;


export {
     loginSchema,
     signupSchema,
}
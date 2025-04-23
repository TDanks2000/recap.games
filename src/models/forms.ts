import { z } from "zod";

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	username: z.string().min(1),
});

export type RegisterFormType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type LoginFormType = z.infer<typeof LoginSchema>;

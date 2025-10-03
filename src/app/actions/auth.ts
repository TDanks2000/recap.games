"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import type { LoginInput, RegisterInput } from "@/models/forms";
import { loginSchema, registerSchema } from "@/models/forms";
import { signIn, signOut } from "@/server/auth";
import { createUser } from "@/server/auth/utils/create";

type ActionResponse = {
	error?: string;
	success?: boolean;
};

export const register = async (
	values: RegisterInput,
): Promise<ActionResponse> => {
	try {
		// Validate with Zod schema
		const validatedData = registerSchema.parse(values);

		// Create user
		await createUser(validatedData);

		// Auto sign-in after registration
		await signIn("credentials", {
			email: validatedData.email,
			password: validatedData.password,
			redirect: false,
		});

		return { success: true };
	} catch (error) {
		console.error("Registration error:", error);

		// Handle Zod validation errors
		if (error instanceof z.ZodError) {
			const firstError = error.errors[0];
			return { error: firstError?.message || "Validation failed" };
		}

		// Handle specific error cases
		if (error instanceof Error) {
			if (
				error.message.includes("unique") ||
				error.message.includes("duplicate")
			) {
				return { error: "Username or email already exists" };
			}
		}

		return { error: "Failed to create account. Please try again." };
	}
};

export const login = async (values: LoginInput): Promise<ActionResponse> => {
	try {
		// Validate with Zod schema
		const validatedData = loginSchema.parse(values);

		await signIn("credentials", {
			email: validatedData.identifier,
			password: validatedData.password,
			redirect: false,
		});

		return { success: true };
	} catch (error) {
		console.error("Login error:", error);

		// Handle Zod validation errors
		if (error instanceof z.ZodError) {
			const firstError = error.errors[0];
			return { error: firstError?.message || "Validation failed" };
		}

		// Handle NextAuth specific errors
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid email/username or password" };
				case "AccessDenied":
					return { error: "Access denied. Please verify your account." };
				default:
					return { error: "Authentication failed. Please try again." };
			}
		}

		return { error: "An unexpected error occurred. Please try again." };
	}
};

export const logout = async (): Promise<void> => {
	try {
		await signOut({
			redirect: false,
		});
	} catch (error) {
		console.error("Logout error:", error);
	}
};

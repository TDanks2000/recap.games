"use server";

import type { LoginFormType, RegisterFormType } from "@/models/forms";
import { signIn, signOut } from "@/server/auth";
import { createUser } from "@/server/auth/utils/create";

export const register = async (values: RegisterFormType) => {
	await createUser(values);
};

export const login = async (values: LoginFormType) =>
	await signIn("credentials", {
		email: values.email,
		password: values.password,
		redirectTo: "/",
	});

export const logout = async () =>
	await signOut({
		redirectTo: "/",
	});

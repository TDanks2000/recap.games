import type { RegisterFormType } from "@/models/forms";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { hashPassword } from "./password";

/**
 * Creates a new user with secure password hashing and validation
 * @param credentials - User registration credentials
 * @returns The created user object or null if creation fails
 */
export const createUser = async (credentials: RegisterFormType) => {
	try {
		const { email, password, firstName, lastName, username } = credentials;

		// Check if user with this email or username already exists
		const existingUser = await db.query.users.findFirst({
			where: (users, { or, eq }) =>
				or(eq(users.email, email), eq(users.username, username)),
		});

		if (existingUser) {
			return null; // User already exists with this email or username
		}

		// Hash the password securely
		const hashedPassword = await hashPassword(password);

		// Create the user with validated data
		const [newUser] = await db
			.insert(users)
			.values({
				email,
				password: hashedPassword,
				name: `${firstName} ${lastName}`,
				username,
			})
			.returning();

		return newUser;
	} catch (error) {
		console.error("Error creating user:", error);
		return null;
	}
};

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { hashPassword } from "./password";

type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
};

/**
 * Registers a new user with email and password
 * @param params - User registration parameters
 * @returns The created user or null if registration failed
 */
export async function registerUser({
  name,
  email,
  password,
}: RegisterUserParams) {
  try {
    // Check if user with this email already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return null; // User already exists
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    return newUser;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}

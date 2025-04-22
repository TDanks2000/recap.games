import bcrypt from "bcryptjs";

/**
 * Hashes a password using bcrypt
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a salt with cost factor 12 (recommended)
  const salt = await bcrypt.genSalt(12);

  // Hash the password with the generated salt
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain text password with a hashed password
 * @param plainPassword - The plain text password to check
 * @param hashedPassword - The hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

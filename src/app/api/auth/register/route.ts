import { registerUser } from "@/server/auth/register";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for registration request
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    // Register the user
    const user = await registerUser(result.data);

    if (!user) {
      return NextResponse.json(
        { error: "User registration failed. Email may already be in use." },
        { status: 409 }
      );
    }

    // Return success without exposing sensitive data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

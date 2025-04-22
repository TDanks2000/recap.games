# Authentication System

This directory contains the authentication system for the application, which uses NextAuth.js with both Discord OAuth and email/password (credentials) authentication.

## Features

- Discord OAuth authentication
- Email/password authentication with secure password hashing
- User registration API
- Role-based authorization

## Usage

### Registering a New User

To register a new user with email and password, make a POST request to the `/api/auth/register` endpoint:

```typescript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "User Name",
    email: "user@example.com",
    password: "securepassword",
  }),
});

const data = await response.json();
```

### Signing In

To sign in with email and password, use the NextAuth.js signIn function:

```typescript
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  email: "user@example.com",
  password: "securepassword",
  redirect: false,
});
```

### Password Utilities

The `password-utils.ts` file provides functions for hashing and verifying passwords:

- `hashPassword(password: string)`: Hashes a password using bcrypt
- `verifyPassword(plainPassword: string, hashedPassword: string)`: Verifies a password against a hash

## Security Notes

- Passwords are hashed using bcrypt with a cost factor of 12
- User passwords are never stored in plain text
- The registration API includes validation to ensure password strength

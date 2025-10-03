"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { register } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/models/forms";

export function SignUpForm() {
	const emailId = useId();
	const usernameId = useId();
	const firstNameId = useId();
	const lastNameId = useId();
	const passwordId = useId();
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setFieldErrors({});

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email")?.toString().trim() || "";
		const username = formData.get("username")?.toString().trim() || "";
		const firstName = formData.get("firstName")?.toString().trim() || "";
		const lastName = formData.get("lastName")?.toString().trim() || "";
		const password = formData.get("password")?.toString() || "";

		// Validate with Zod
		const result = registerSchema.safeParse({
			email,
			username,
			firstName,
			lastName,
			password,
		});

		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.errors.forEach((error) => {
				if (error.path[0]) {
					errors[error.path[0].toString()] = error.message;
				}
			});
			setFieldErrors(errors);
			setError("Please fix the errors below");
			return;
		}

		startTransition(async () => {
			try {
				const response = await register(result.data);

				if (response?.error) {
					setError(response.error);
				} else if (response?.success) {
					setError(null);
					router.replace("/");
				}
			} catch (err) {
				setError("An unexpected error occurred. Please try again.");
				console.error("Registration error:", err);
			}
		});
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create Account</CardTitle>
					<CardDescription>Sign up for a new account</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label htmlFor={emailId}>Email</Label>
						<Input
							id={emailId}
							name="email"
							type="email"
							placeholder="Enter your email"
							required
							disabled={isPending}
							autoComplete="email"
							aria-invalid={!!fieldErrors.email}
						/>
						{fieldErrors.email && (
							<p className="text-destructive text-sm">{fieldErrors.email}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor={usernameId}>Username</Label>
						<Input
							id={usernameId}
							name="username"
							type="text"
							placeholder="Choose a username"
							required
							disabled={isPending}
							autoComplete="username"
							aria-invalid={!!fieldErrors.username}
						/>
						{fieldErrors.username && (
							<p className="text-destructive text-sm">{fieldErrors.username}</p>
						)}
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={firstNameId}>First Name</Label>
							<Input
								id={firstNameId}
								name="firstName"
								type="text"
								placeholder="First name"
								required
								disabled={isPending}
								autoComplete="given-name"
								aria-invalid={!!fieldErrors.firstName}
							/>
							{fieldErrors.firstName && (
								<p className="text-destructive text-sm">
									{fieldErrors.firstName}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor={lastNameId}>Last Name</Label>
							<Input
								id={lastNameId}
								name="lastName"
								type="text"
								placeholder="Last name"
								required
								disabled={isPending}
								autoComplete="family-name"
								aria-invalid={!!fieldErrors.lastName}
							/>
							{fieldErrors.lastName && (
								<p className="text-destructive text-sm">
									{fieldErrors.lastName}
								</p>
							)}
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor={passwordId}>Password</Label>
						<Input
							id={passwordId}
							name="password"
							type="password"
							placeholder="Create a password"
							required
							disabled={isPending}
							autoComplete="new-password"
							aria-invalid={!!fieldErrors.password}
						/>
						{fieldErrors.password && (
							<p className="text-destructive text-sm">{fieldErrors.password}</p>
						)}
						<p className="text-muted-foreground text-xs">
							Must be at least 8 characters with uppercase, lowercase, and
							numbers
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? "Creating account..." : "Create Account"}
					</Button>

					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link href="/auth/sign-in" className="underline underline-offset-4">
							Sign in
						</Link>
					</div>
				</CardFooter>
			</Card>
		</form>
	);
}

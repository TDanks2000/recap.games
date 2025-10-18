"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { login } from "@/app/actions/auth";
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
import { loginSchema } from "@/models/forms";

export function SignInForm() {
	const identifierId = useId();
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
		const identifier = formData.get("identifier")?.toString().trim() || "";
		const password = formData.get("password")?.toString() || "";

		// Validate with Zod
		const result = loginSchema.safeParse({ identifier, password });

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
				const response = await login(result.data);

				if (response?.error) {
					setError(response.error);
				} else if (response?.success) {
					// Clear any visible error and navigate immediately to avoid flash
					setError(null);
					router.replace("/");
				}
			} catch (err) {
				setError("An unexpected error occurred. Please try again.");
				console.error("Login error:", err);
			}
		});
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			<Card className="w-full min-w-sm max-w-md">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label htmlFor={identifierId}>Email or username</Label>
						<Input
							id={identifierId}
							name="identifier"
							type="text"
							placeholder="Enter your email or username"
							required
							disabled={isPending}
							autoComplete="username"
							aria-invalid={!!fieldErrors.identifier}
						/>
						{fieldErrors.identifier && (
							<p className="text-destructive text-sm">
								{fieldErrors.identifier}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor={passwordId}>Password</Label>
							<Link
								href="/auth/forgot-password"
								className="text-muted-foreground text-sm hover:underline"
								tabIndex={-1}
							>
								Forgot password?
							</Link>
						</div>
						<Input
							id={passwordId}
							name="password"
							type="password"
							placeholder="Enter your password"
							required
							disabled={isPending}
							autoComplete="current-password"
							aria-invalid={!!fieldErrors.password}
						/>
						{fieldErrors.password && (
							<p className="text-destructive text-sm">{fieldErrors.password}</p>
						)}
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? "Signing in..." : "Sign In"}
					</Button>
					{/* <Button
						type="button"
						variant="outline"
						className="w-full"
						disabled={isPending}
						onClick={() => {
							// Discord OAuth handler
						}}
					>
						Sign in with Discord
					</Button> */}
					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link href="/auth/sign-up" className="underline underline-offset-4">
							Sign up
						</Link>
					</div>
				</CardFooter>
			</Card>
		</form>
	);
}

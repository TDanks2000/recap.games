import Link from "next/link";
import { useId } from "react";
import { login } from "@/app/actions/auth";
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

export function SignInForm() {
	const emailId = useId();
	const passwordId = useId();

	return (
		<form
			action={async (form) => {
				"use server";
				const email = form.get("email")?.toString();
				const password = form.get("password")?.toString();

				if (!email?.length || !password?.length) {
					return;
				}

				await login({
					email,
					password,
				});
			}}
		>
			<Card className="w-full min-w-sm max-w-md">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={emailId}>Email</Label>
						<Input
							id={emailId}
							name="email"
							type="email"
							placeholder="Enter your email"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor={passwordId}>Password</Label>
						<Input
							id={passwordId}
							name="password"
							type="password"
							placeholder="Enter your password"
							required
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full">
						Sign In
					</Button>
					<Button variant="outline" className="w-full">
						Sign in with Discord
					</Button>
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

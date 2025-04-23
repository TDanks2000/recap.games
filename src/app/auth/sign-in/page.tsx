import { SignInForm } from "@/features/auth/components/sign-in-form";
import { HydrateClient } from "@/trpc/server";

export default function SignInPage() {
	return (
		<HydrateClient>
			<main className="flex min-h-screen items-center justify-center p-5 px-4 transition-all md:px-10">
				<SignInForm />
			</main>
		</HydrateClient>
	);
}

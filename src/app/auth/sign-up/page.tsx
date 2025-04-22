import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { HydrateClient } from "@/trpc/server";

export default function SignUpPage() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen items-center justify-center p-5 px-4 transition-all md:px-10">
        <SignUpForm />
      </main>
    </HydrateClient>
  );
}

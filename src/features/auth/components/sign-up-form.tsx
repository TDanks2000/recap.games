import { register } from "@/app/actions/auth";
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
import Link from "next/link";

export function SignUpForm() {
  return (
    <form
      action={async (values) => {
        "use server";
        const username = values.get("username")?.toString();
        const email = values.get("email")?.toString();
        const password = values.get("password")?.toString();
        const firstName = values.get("firstName")?.toString();
        const lastName = values.get("lastName")?.toString();

        if (
          !username?.length ||
          !email?.length ||
          !password?.length ||
          !firstName?.length ||
          !lastName?.length
        ) {
          return;
        }

        await register({
          username,
          email,
          password,
          firstName,
          lastName,
        });
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up for a new account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            Create Account
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

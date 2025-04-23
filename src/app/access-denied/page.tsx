import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AccessDenied() {
	return (
		<div className="flex min-h-[85svh] w-svw items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Access Denied</CardTitle>
					<CardDescription>
						You don't have permission to access this page.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						This area is restricted to administrators only. If you believe you
						should have access, please contact the site administrator.
					</p>
				</CardContent>
				<CardFooter>
					<Link href="/" className="w-full">
						<Button className="w-full">Return to Home</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}

import { Mail, Shield } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function ContactPage() {
	return (
		<main className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="space-y-16">
				<div className="space-y-5 text-center">
					<h1 className="font-bold text-4xl text-primary tracking-tight sm:text-5xl">
						Get in Touch
					</h1>
					<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
						Have a question, suggestion, or just want to say hello? We'd love to
						hear from you. You can reach us at the email addresses below.
					</p>
				</div>

				<div className="mx-auto max-w-4xl">
					<Card className="overflow-hidden rounded-xl shadow-lg">
						<CardHeader className="p-6 text-center sm:p-8">
							<CardTitle className="font-semibold text-3xl">
								Contact Information
							</CardTitle>
							<CardDescription>
								We'll do our best to get back to you as soon as possible.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-6 p-6 pt-0 sm:grid-cols-2 sm:p-8 sm:pt-0">
							<div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition-colors hover:border-primary/50">
								<div className="rounded-lg bg-primary/10 p-3">
									<Mail className="h-8 w-8 text-primary" />
								</div>
								<h3 className="font-semibold text-xl">General Inquiries</h3>
								<p className="flex-grow text-muted-foreground text-sm">
									For feedback, suggestions, or partnership opportunities.
								</p>
								<a
									href="mailto:contact@recap.games"
									className="mt-4 font-medium text-primary hover:underline"
								>
									contact@recap.games
								</a>
							</div>
							<div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition-colors hover:border-primary/50">
								<div className="rounded-lg bg-primary/10 p-3">
									<Shield className="h-8 w-8 text-primary" />
								</div>
								<h3 className="font-semibold text-xl">Privacy Matters</h3>
								<p className="flex-grow text-muted-foreground text-sm">
									For any questions regarding your data and our privacy policy.
								</p>
								<a
									href="mailto:privacy@recap.games"
									className="mt-4 font-medium text-primary hover:underline"
								>
									privacy@recap.games
								</a>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
}

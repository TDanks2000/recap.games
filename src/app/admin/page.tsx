import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
	const adminSections = [
		{
			title: "Games",
			description: "Add, edit, or remove games with media attachments",
			href: "/admin/games",
		},
		{
			title: "Conferences",
			description: "Manage gaming conferences and their schedules",
			href: "/admin/conferences",
		},
		{
			title: "Streams",
			description: "Add or edit streams associated with conferences",
			href: "/admin/streams",
		},
	];

	return (
		<div className="space-y-6">
			<h2 className="font-semibold text-xl">Welcome to the Admin Dashboard</h2>
			<p className="text-muted-foreground">
				Use this dashboard to manage content for the recap.games website.
			</p>

			<div className="grid gap-4 md:grid-cols-3">
				{adminSections.map((section) => (
					<Link key={section.href} href={section.href}>
						<Card className="h-full cursor-pointer transition-all hover:shadow-md">
							<CardHeader>
								<CardTitle>{section.title}</CardTitle>
								<CardDescription>{section.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-blue-500 text-sm">
									Manage {section.title} →
								</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BlogAnalytics } from "./blogAnalytics";

interface DashboardProps {
	contentSections: {
		title: string;
		description: string;
		href: string;
	}[];
	statsSections?: {
		title: string;
		description: string;
		href: string;
		icon: React.ReactNode;
		stats: {
			value: string;
			label: string;
			change: string;
			trend: "up" | "down" | "neutral";
		};
	}[];
	quickActions: {
		title: string;
		href: string;
	}[];
}

export function Dashboard({ contentSections, quickActions }: DashboardProps) {
	return (
		<div className="space-y-8">
			<div>
				<h2 className="font-semibold text-2xl">
					Welcome to the Admin Dashboard
				</h2>
				<p className="mt-1 text-muted-foreground">
					Use this dashboard to manage content for the recap.games website.
				</p>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						{quickActions.map((action) => (
							<Button key={action.href} variant="outline" asChild>
								<Link href={action.href}>{action.title}</Link>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Content Management */}
			<div>
				<h3 className="mb-4 font-semibold text-xl">Content Management</h3>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{contentSections.map((section) => (
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

			{/* Blog Analytics */}
			<BlogAnalytics />
		</div>
	);
}

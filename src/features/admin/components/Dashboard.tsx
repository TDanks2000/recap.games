"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import type { ContentSection, QuickAction, StatSection } from "@/@types/admin";
import { Badge } from "@/components/ui/badge";
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
	contentSections: ContentSection[];
	statsSections?: StatSection[];
	quickActions: QuickAction[];

	session: Session | null;
}

function StatCard({ section }: { section: StatSection }) {
	return (
		<Link key={section.href} href={section.href}>
			<Card className="h-full overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="font-medium text-base">
							{section.title}
						</CardTitle>
						<div className="rounded-md bg-muted/50 p-1.5">{section.icon}</div>
					</div>
					<CardDescription className="line-clamp-2 h-10">
						{section.description}
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	);
}

function ContentCard({ section }: { section: ContentSection }) {
	return (
		<Link key={section.href} href={section.href}>
			<Card className="h-full overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle>{section.title}</CardTitle>
						{section.count !== undefined && (
							<Badge variant="secondary" className="px-2 py-0.5">
								{section.count}
							</Badge>
						)}
					</div>
					<CardDescription className="line-clamp-2 h-10">
						{section.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					{section.icon && <div className="mb-4">{section.icon}</div>}
					<div className="flex items-center font-medium text-primary text-sm">
						Manage {section.title}
						<ArrowRight className="ml-1 h-4 w-4" />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

function QuickActionButton({ action }: { action: QuickAction }) {
	return (
		<Button
			key={action.href}
			variant={action.priority === "high" ? "default" : "outline"}
			size="sm"
			className="gap-2"
			asChild
		>
			<Link href={action.href}>
				{action.icon}
				{action.title}
				{action.badge && (
					<Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
						{action.badge}
					</Badge>
				)}
			</Link>
		</Button>
	);
}

export function Dashboard({
	contentSections,
	statsSections = [],
	quickActions,
}: DashboardProps) {
	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div>
					<h2 className="font-bold text-3xl text-foreground/90">
						Welcome Back
					</h2>
					<p className="mt-1 text-muted-foreground">
						Manage and monitor your recap.games content from one central
						dashboard.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className="border-primary/20 bg-primary/5 px-3 py-1 text-primary text-xs"
					>
						Admin Portal
					</Badge>
					<Badge variant="outline" className="px-3 py-1 text-xs">
						v1.0.0
					</Badge>
				</div>
			</div>

			{statsSections.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-xl">Analytics Overview</h3>
						<Button
							variant="ghost"
							size="sm"
							className="gap-1 text-muted-foreground text-sm"
							asChild
						>
							<Link href="/admin/analytics">
								View All
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</Button>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{statsSections.map((section) => (
							<StatCard key={section.href} section={section} />
						))}
					</div>
				</div>
			)}

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-xl">Content Management</h3>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{contentSections.map((section) => (
						<ContentCard key={section.href} section={section} />
					))}
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-xl">Quick Actions</h3>
				</div>
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-wrap gap-3">
							{quickActions.map((action) => (
								<QuickActionButton key={action.href} action={action} />
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<BlogAnalytics />
		</div>
	);
}

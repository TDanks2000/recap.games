import {
	Activity,
	CalendarDays,
	CalendarPlus,
	FileText,
	GamepadIcon,
	Newspaper,
	PlaySquare,
	Tv2,
} from "lucide-react";
import type { ContentSection, QuickAction } from "@/@types/admin";
import { Dashboard } from "@/features/admin/components/Dashboard";
import { auth } from "@/server/auth";

export default async function AdminDashboardPage() {
	const session = await auth();

	// Content management sections with enhanced descriptions
	const contentSections: Array<ContentSection> = [
		{
			title: "Games",
			description:
				"Manage the announced games, their details, and associated media",
			href: "/admin/games",
			icon: <GamepadIcon className="h-10 w-10 text-primary/80" />,
		},
		{
			title: "Conferences",
			description:
				"Manage conference events, schedules, and related information",
			href: "/admin/conferences",
			icon: <CalendarDays className="h-10 w-10 text-amber-500/80" />,
		},
		{
			title: "Streams",
			description: "Manage conference streams and their settings",
			href: "/admin/streams",
			icon: <PlaySquare className="h-10 w-10 text-blue-500/80" />,
		},
		{
			title: "Blog Posts",
			description: "Create and publish articles, news, and editorial content",
			href: "/blog",
			icon: <FileText className="h-10 w-10 text-green-500/80" />,
		},
	];

	// Quick action buttons with prioritized tasks
	const quickActions: Array<QuickAction> = [
		{
			title: "Add New Game",
			href: "/admin/games?action=new",
			priority: "high",
			icon: <Activity className="h-4 w-4" />,
		},
		{
			title: "Add new Conference",
			href: "/admin/conferences?action=new",
			priority: "medium",
			icon: <CalendarPlus className="h-4 w-4" />,
		},
		{
			title: "Add new Stream",
			href: "/admin/streams?action=new",
			priority: "low",
			icon: <Tv2 className="h-4 w-4" />,
		},
		{
			title: "Create Blog Post",
			href: "/blog/create",
			priority: "medium",
			icon: <Newspaper className="h-4 w-4" />,
		},
	];

	return (
		<Dashboard
			contentSections={contentSections}
			quickActions={quickActions}
			session={session}
		/>
	);
}

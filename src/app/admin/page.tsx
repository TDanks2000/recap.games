import { BarChart, LineChart, PieChart } from "lucide-react";
import { Dashboard } from "@/features/admin/components/Dashboard";

export default function AdminDashboardPage() {
	const contentSections = [
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
		{
			title: "Blog Posts",
			description: "Manage blog content, drafts, and publications",
			href: "/admin/blog",
		},
	];

	const statsSections = [
		{
			title: "User Analytics",
			description: "View user engagement and growth statistics",
			href: "/admin/analytics/users",
			icon: <BarChart className="h-8 w-8 text-blue-500" />,
			stats: {
				value: "2,451",
				label: "Active Users",
				change: "+12%",
				trend: "up" as const,
			},
		},
		{
			title: "Content Performance",
			description: "Track views and engagement across all content",
			href: "/admin/analytics/content",
			icon: <LineChart className="h-8 w-8 text-green-500" />,
			stats: {
				value: "18.2K",
				label: "Monthly Views",
				change: "+8%",
				trend: "up" as const,
			},
		},
		{
			title: "Traffic Sources",
			description: "Analyze where your visitors are coming from",
			href: "/admin/analytics/traffic",
			icon: <PieChart className="h-8 w-8 text-primary" />,
			stats: {
				value: "5",
				label: "Top Sources",
				change: "Social Media",
				trend: "neutral" as const,
			},
		},
	];

	const quickActions = [
		{
			title: "Add New Game",
			href: "/admin/games?action=new",
		},
		{
			title: "Create Blog Post",
			href: "/blog/create",
		},
		{
			title: "Update Featured Content",
			href: "/admin/featured",
		},
		{
			title: "Moderate Comments",
			href: "/admin/comments",
		},
	];

	return (
		<Dashboard
			contentSections={contentSections}
			statsSections={statsSections}
			quickActions={quickActions}
		/>
	);
}

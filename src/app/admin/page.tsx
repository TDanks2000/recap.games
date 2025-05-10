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
		<Dashboard contentSections={contentSections} quickActions={quickActions} />
	);
}

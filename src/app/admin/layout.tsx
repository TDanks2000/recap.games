import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@/@types/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/server/auth";
import { ClientNavigation } from "./client-navigation";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Server-side authentication check
	const session = await auth();

	// If user is not authenticated or not an admin, redirect to access-denied page
	if (!session?.user || session.user.role !== UserRole.ADMIN) {
		redirect("/access-denied");
	}

	const navItems = [
		{ name: "Dashboard", href: "/admin" },
		{ name: "Games", href: "/admin/games" },
		{ name: "Conferences", href: "/admin/conferences" },
		{ name: "Streams", href: "/admin/streams" },
	];

	return (
		<div className="container mx-auto py-6">
			<div className="flex flex-col space-y-6">
				<header className="flex items-center justify-between">
					<h1 className="font-bold text-2xl">Admin Dashboard</h1>
					<Link href="/">
						<Button variant="outline">Back to Site</Button>
					</Link>
				</header>
				<Separator />

				<div className="flex flex-col space-y-8 md:flex-row md:space-x-6 md:space-y-0">
					<aside className="md:w-1/5">
						<nav className="flex flex-col space-y-1">
							<ClientNavigation navItems={navItems} />
						</nav>
					</aside>

					<main className="flex-1">{children}</main>
				</div>
			</div>
		</div>
	);
}

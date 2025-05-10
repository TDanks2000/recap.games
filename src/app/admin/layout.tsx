import { redirect } from "next/navigation";
import { UserRole } from "@/@types/db";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { auth } from "@/server/auth";

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

	return (
		<div className="flex h-screen w-full overflow-hidden">
			<AdminSidebar>{children}</AdminSidebar>
		</div>
	);
}

"use client";

import {
	CalendarDays,
	FileText,
	GamepadIcon,
	LayoutDashboard,
	PlaySquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"; // Ensure you have this utility

interface AdminSidebarProps {
	children?: React.ReactNode;
}

interface NavItemBase {
	title: string;
	icon?: React.ReactNode;
}

interface SingleNavItem extends NavItemBase {
	href: string;
	icon: React.ReactNode;
}

interface NavItemGroup extends NavItemBase {
	items: SingleNavItem[];
	href?: undefined;
	icon?: undefined;
}

type NavItem = SingleNavItem | NavItemGroup;

export function AdminSidebar({ children }: AdminSidebarProps) {
	const pathname = usePathname();

	const navItems: NavItem[] = [
		{
			title: "Dashboard",
			href: "/admin",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			title: "Content",
			items: [
				{
					title: "Games",
					href: "/admin/games",
					icon: <GamepadIcon className="h-5 w-5" />,
				},
				{
					title: "Conferences",
					href: "/admin/conferences",
					icon: <CalendarDays className="h-5 w-5" />,
				},
				{
					title: "Streams",
					href: "/admin/streams",
					icon: <PlaySquare className="h-5 w-5" />,
				},
				{
					title: "Blog Posts",
					href: "/admin/blog",
					icon: <FileText className="h-5 w-5" />,
				},
			],
		},
	];

	return (
		<SidebarProvider defaultOpen={true}>
			<Sidebar className="border-r">
				<SidebarHeader className="px-4 py-3">
					<Link href="/admin" className="flex items-center gap-2">
						<span className="font-semibold text-xl">Admin</span>
					</Link>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						{navItems.map((item) => {
							if ("items" in item && item.items) {
								return (
									<SidebarGroup key={item.title} className="mb-2">
										<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
										{item.items.map((subItem) => (
											<SidebarMenuItem key={subItem.title}>
												<Link
													href={subItem.href}
													className={cn(
														"flex w-full items-center gap-3 rounded-md px-3 py-2 font-medium text-sm",
														pathname === subItem.href
															? "bg-muted [&_svg]:text-primary"
															: "text-muted-foreground hover:bg-muted hover:text-primary",
													)}
												>
													{subItem.icon}
													<span>{subItem.title}</span>
												</Link>
											</SidebarMenuItem>
										))}
									</SidebarGroup>
								);
							}

							return (
								<SidebarMenuItem key={item.title}>
									<Link
										href={(item as SingleNavItem).href}
										className={cn(
											"flex w-full items-center gap-3 rounded-md px-3 py-2 font-medium text-sm",
											pathname === (item as SingleNavItem).href
												? "bg-muted [&_svg]:text-primary"
												: "text-muted-foreground hover:bg-muted hover:text-primary",
										)}
									>
										{item.icon}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter className="px-4 py-3">
					<Link href="/">
						<Button variant="outline" className="w-full">
							Back to Site
						</Button>
					</Link>
				</SidebarFooter>
			</Sidebar>
			<div className="flex-1 overflow-auto p-6">{children}</div>
		</SidebarProvider>
	);
}

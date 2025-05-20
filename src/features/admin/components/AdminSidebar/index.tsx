"use client";

import {
	CalendarDays,
	FileText,
	GamepadIcon,
	Home,
	LayoutDashboard,
	PlaySquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarProvider,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminSidebarNavItem } from "./AdminSidebarItem";

interface AdminSidebarProps {
	children?: React.ReactNode;

	session: Session | null;
}

type NavItem =
	| {
			title: string;
			href: string;
			icon: React.ReactNode;
			badge?: string | number;
	  }
	| {
			title: string;
			items: {
				title: string;
				href: string;
				icon: React.ReactNode;
				badge?: string | number;
			}[];
	  };

const navItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: <LayoutDashboard className="size-5" />,
	},
	{
		title: "Content",
		items: [
			{
				title: "Games",
				href: "/admin/games",
				icon: <GamepadIcon className="size-5" />,
			},
			{
				title: "Conferences",
				href: "/admin/conferences",
				icon: <CalendarDays className="h-5 w-5" />,
			},
			{
				title: "Streams",
				href: "/admin/streams",
				icon: <PlaySquare className="size-5" />,
			},
			{
				title: "Blog Posts",
				href: "/blog",
				icon: <FileText className="size-5" />,
			},
		],
	},
];

export function AdminSidebar({ children, session }: AdminSidebarProps) {
	const pathname = usePathname();
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	return (
		<SidebarProvider defaultOpen>
			<Sidebar className="border-r bg-card/40 backdrop-blur-sm">
				<SidebarHeader className="px-6 py-4 border-b border-border/50">
					<Link href="/admin" className="flex items-center gap-3">
						<div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
							<Home className="h-5 w-5 text-primary" />
						</div>
						<span className="font-semibold text-xl">Admin</span>
					</Link>
				</SidebarHeader>
				<SidebarContent>
					<ScrollArea className="h-[calc(100vh-12rem)]">
						<div className="px-1">
							<div className="flex items-center gap-3 px-3 py-2 mb-6">
								<Avatar className="h-10 w-10 flex justify-center items-center border-2 border-primary/20">
									<AvatarFallback className="bg-primary/10 text-primary font-medium">
										{session?.user?.username?.split("").splice(0, 2).join("")}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="font-medium text-sm">
										{session?.user?.username}
									</span>
									<span className="text-xs text-muted-foreground">
										{session?.user?.role}
									</span>
								</div>
							</div>
							<SidebarMenu>
								{navItems.map((item) =>
									"items" in item ? (
										<SidebarGroup key={item.title} className="mb-4">
											<SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
												{item.title}
											</SidebarGroupLabel>
											<div className="space-y-1 mt-1">
												{item.items.map((subItem) => (
													<AdminSidebarNavItem
														key={subItem.title}
														item={subItem}
														pathname={pathname}
														hoveredItem={hoveredItem}
														setHoveredItem={setHoveredItem}
													/>
												))}
											</div>
										</SidebarGroup>
									) : (
										<AdminSidebarNavItem
											key={item.title}
											item={item}
											pathname={pathname}
											hoveredItem={hoveredItem}
											setHoveredItem={setHoveredItem}
										/>
									),
								)}
							</SidebarMenu>
						</div>
					</ScrollArea>
				</SidebarContent>
				<SidebarFooter className="border-t border-border/50 px-6 py-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Link href="/">
								<Button variant="outline" className="w-full gap-2 font-medium">
									<Home className="h-4 w-4" />
									Back to Site
								</Button>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Return to main site</TooltipContent>
					</Tooltip>
				</SidebarFooter>
			</Sidebar>
			<div className="flex-1 overflow-auto p-6">{children}</div>
		</SidebarProvider>
	);
}

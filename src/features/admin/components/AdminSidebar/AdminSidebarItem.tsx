import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib";

export function AdminSidebarNavItem({
	item,
	pathname,
	hoveredItem,
	setHoveredItem,
}: {
	item: {
		title: string;
		href: string;
		icon: React.ReactNode;
		badge?: string | number;
	};
	pathname: string;
	hoveredItem: string | null;
	setHoveredItem: (href: string | null) => void;
}) {
	const isActive = pathname === item.href;
	return (
		<SidebarMenuItem>
			<Link
				href={item.href}
				className={cn(
					"group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 font-medium text-sm transition-all duration-200 ease-in-out",
					isActive
						? "bg-primary/10 text-primary"
						: "text-muted-foreground hover:bg-muted hover:text-foreground",
				)}
				onMouseEnter={() => setHoveredItem(item.href)}
				onMouseLeave={() => setHoveredItem(null)}
			>
				<span
					className={cn(
						"absolute left-0 h-full w-1 rounded-r-full bg-primary transition-all duration-200",
						isActive ? "opacity-100" : "opacity-0",
					)}
				/>
				<span
					className={cn(
						"flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200",
						isActive
							? "bg-primary text-primary-foreground"
							: "bg-muted/50 text-muted-foreground group-hover:text-foreground",
					)}
				>
					{item.icon}
				</span>
				<span>{item.title}</span>
				{item.badge && (
					<Badge
						variant="outline"
						className="ml-auto border-primary/20 bg-primary/5 px-1.5 py-0 text-primary text-xs"
					>
						{item.badge}
					</Badge>
				)}
				{hoveredItem === item.href && !isActive && (
					<ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50" />
				)}
			</Link>
		</SidebarMenuItem>
	);
}

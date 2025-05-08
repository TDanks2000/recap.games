"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type NavItem = {
	name: string;
	href: string;
};

interface ClientNavigationProps {
	navItems: NavItem[];
}

export function ClientNavigation({ navItems }: ClientNavigationProps) {
	const pathname = usePathname();

	return (
		<>
			{navItems.map((item) => (
				<Link key={item.href} href={item.href}>
					<Button
						variant={pathname === item.href ? "default" : "ghost"}
						className="w-full justify-start"
					>
						{item.name}
					</Button>
				</Link>
			))}
		</>
	);
}

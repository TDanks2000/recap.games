"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BlogHeroProps {
	title: string;
	/** e.g. [{ href: "/blog", label: "Blog" }, …] */
	breadcrumb?: { href: string; label: string }[];
	render?: ReactNode;
}

export function BlogHero({ title, breadcrumb, render }: BlogHeroProps) {
	const pathname = usePathname();

	const pathSegments = pathname
		.split("/")
		.filter(Boolean)
		.map((segment, index, array) => ({
			href: `/${array.slice(0, index + 1).join("/")}`,
			label: segment.charAt(0).toUpperCase() + segment.slice(1),
		}));

	const combinedBreadcrumb = breadcrumb || pathSegments;

	return (
		<header className="w-full bg-gradient-to-br from-primary to-primary/5 px-8 py-10 text-white">
			<div className="mx-auto max-w-7xl px-8 sm:px-16">
				{combinedBreadcrumb.length > 0 && (
					<nav className="mb-4">
						<Breadcrumb>
							<BreadcrumbList>
								{combinedBreadcrumb.map((item, i) => (
									<React.Fragment key={item.label}>
										<BreadcrumbItem>
											{item.href === pathname ? (
												<BreadcrumbPage>{item.label}</BreadcrumbPage>
											) : (
												<BreadcrumbLink asChild>
													<Link href={item.href}>{item.label}</Link>
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
										<BreadcrumbSeparator />
									</React.Fragment>
								))}
								<BreadcrumbItem>
									<BreadcrumbPage>{title}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</nav>
				)}
				<h1 className="mb-4 font-extrabold text-4xl leading-tight">{title}</h1>
				{render && <div className="mt-8">{render}</div>}
			</div>
		</header>
	);
}

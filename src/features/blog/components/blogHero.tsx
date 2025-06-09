"use client";

import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ReactNode } from "react";
import { DateComponent } from "@/components/date";
import { ShareButton } from "@/components/share-button";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useReadingTime } from "@/lib/readingTime";

interface BlogHeroProps {
	title: string;
	breadcrumb?: { href: string; label: string }[];
	render?: ReactNode;
	showShareButton?: boolean;
	content?: string;
	publishedDate?: Date;
	authorName?: string | null;
}

export function BlogHero({
	title,
	breadcrumb,
	render,
	showShareButton,
	content,
	publishedDate,
	authorName,
}: BlogHeroProps) {
	const pathname = usePathname();

	const { text: readingTime } = useReadingTime(content || "", {
		contentType: "blog",
	});

	const pathSegments = pathname
		.split("/")
		.filter(Boolean)
		.map((segment, index, array) => ({
			href: `/${array.slice(0, index + 1).join("/")}`,
			label: segment.charAt(0).toUpperCase() + segment.slice(1),
		}));

	const combinedBreadcrumb = breadcrumb || pathSegments;

	return (
		<div className="relative w-full overflow-hidden px-8 py-14 drop-shadow-xl">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />

			{/* Animated background image */}
			<div className="absolute inset-0 animate-float-background">
				<Image
					src="/tiled-bg.png"
					alt="Tiled background"
					className="absolute inset-0 scale-105 overflow-hidden object-cover opacity-50"
					width={1920}
					height={1080}
				/>
			</div>

			<div className="relative mx-auto max-w-7xl px-8 sm:px-16">
				<div className="mb-3 flex flex-row items-center gap-3">
					{!!showShareButton && <ShareButton title={title} />}
					{combinedBreadcrumb.length > 0 && (
						<Breadcrumb className="overflow-x-auto">
							<BreadcrumbList className="flex items-center whitespace-nowrap">
								{combinedBreadcrumb.map((item) => (
									<React.Fragment key={item.label}>
										<BreadcrumbItem className="max-w-xs flex-shrink-0">
											{item.href === pathname ? (
												<BreadcrumbPage className="truncate">
													{item.label}
												</BreadcrumbPage>
											) : (
												<BreadcrumbLink asChild>
													<Link href={item.href}>{item.label}</Link>
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
										<BreadcrumbSeparator className="flex-shrink-0" />
									</React.Fragment>
								))}
								<BreadcrumbItem className="w-full max-w-xs shrink-0 overflow-hidden truncate sm:max-w-fit">
									<BreadcrumbPage className="w-full truncate">
										{title}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					)}
				</div>

				<h1 className="mb-4 font-extrabold text-4xl leading-tight drop-shadow-lg">
					{title}
				</h1>

				{(publishedDate || content) && (
					<div className="mb-6 flex flex-wrap items-center gap-3 text-muted-foreground text-sm sm:gap-4">
						{publishedDate && (
							<div className="flex items-center gap-2 rounded-md bg-background/20 px-2.5 py-1.5 backdrop-blur-sm sm:px-3">
								<Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<DateComponent date={publishedDate} />
							</div>
						)}
						{content && (
							<div className="flex items-center gap-2 rounded-md bg-background/20 px-2.5 py-1.5 backdrop-blur-sm sm:px-3">
								<Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span>{readingTime}</span>
							</div>
						)}
						{authorName && (
							<div className="rounded-md bg-background/20 px-2.5 py-1.5 backdrop-blur-sm sm:px-3">
								By {authorName}
							</div>
						)}
					</div>
				)}

				{render && <div className="mt-8">{render}</div>}
			</div>
		</div>
	);
}

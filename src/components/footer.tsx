"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { FaEnvelope, FaTwitter } from "react-icons/fa";
import { SiBluesky, SiInstagram, SiKofi } from "react-icons/si";

const SOCIAL_LINKS = [
	{
		href: "https://twitter.com/gamesrecapped",
		label: "Twitter",
		icon: FaTwitter,
	},
	{
		href: "https://bsky.app/profile/recap.games",
		label: "Bluesky",
		icon: SiBluesky,
	},
	{
		href: "https://www.instagram.com/gamesrecapped/",
		label: "Instagram",
		icon: SiInstagram,
	},
	{
		href: "https://ko-fi.com/tdanks2000",
		label: "Ko-Fi",
		icon: SiKofi,
	},
];

const QUICK_LINKS = [
	{ href: "/blog", label: "Blog" },
	{ href: "/faq", label: "FAQ" },
	{ href: "/privacy-policy", label: "Privacy Policy" },
];

export default function Footer() {
	const pathname = usePathname().toLowerCase();
	const footerHeadingId = useId();

	if (pathname.startsWith("/admin")) return null;

	const year = new Date().getFullYear();

	return (
		<footer className="mt-10 border-t bg-muted/40 py-10">
			<h2 id={footerHeadingId} className="sr-only">
				Site Footer
			</h2>

			<div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
				{/* Logo & Description */}
				<div className="flex flex-col space-y-4">
					<Link href="/" className="inline-flex items-center">
						<Image
							src="/icon.png"
							alt="Recap Games logo"
							width={40}
							height={40}
							className="mr-2"
						/>
						<span className="font-bold text-xl tracking-tight">
							Recap Games
						</span>
					</Link>
					<p className="text-muted-foreground text-sm">
						Your go-to source for game announcements, trailers, and reveals: all
						handpicked, straight to the point, and no fluff.
					</p>
					<div className="flex space-x-4">
						{SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
							<Link
								key={label}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground transition-colors hover:text-primary"
								aria-label={label}
							>
								<Icon className="h-5 w-5" />
							</Link>
						))}
					</div>
				</div>

				{/* Quick Links */}
				<nav className="flex flex-col space-y-2" aria-label="Quick links">
					<h3 className="mb-2 font-semibold">Quick Links</h3>
					{QUICK_LINKS.map(({ href, label }) => (
						<Link
							key={label}
							href={href}
							className="text-muted-foreground transition-colors hover:text-primary"
						>
							{label}
						</Link>
					))}
				</nav>

				{/* Contact */}
				<div className="flex flex-col space-y-2">
					<h3 className="mb-2 font-semibold">Contact Us</h3>
					<Link
						href="mailto:contact@recap.games"
						className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
					>
						<FaEnvelope className="h-4 w-4" />
						<span>contact@recap.games</span>
					</Link>
					<p className="text-muted-foreground text-sm">
						Have questions or feedback? We’d love to hear from you!
					</p>
				</div>
			</div>

			<div className="mt-10 border-border border-t pt-6 text-center text-muted-foreground text-sm">
				&copy; {year} Recap.Games. All rights reserved.
			</div>
		</footer>
	);
}

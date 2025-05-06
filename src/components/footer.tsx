import Image from "next/image";
import Link from "next/link";

// ShadCN UI imports
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Lucide icons
import { Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-gray-900 py-10 text-gray-300">
			<div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
				{/* Logo & Description */}
				<div className="flex flex-col items-start space-y-4">
					<Link href="/" className="inline-flex items-center">
						<Image
							src="/icon.png"
							alt="Logo"
							width={40}
							height={40}
							className="mr-2"
						/>
						<span className="font-bold text-white text-xl tracking-tight">
							YourCompany
						</span>
					</Link>
					<p className="text-sm">
						Building modern experiences with the best tools.
					</p>
				</div>

				{/* Navigation Links */}
				<div className="flex flex-col space-y-2">
					<h3 className="mb-2 font-semibold text-white">Quick Links</h3>
					<Link href="/about" className="hover:text-white">
						About Us
					</Link>
					<Link href="/blog" className="hover:text-white">
						Blog
					</Link>
					<Link href="/contact" className="hover:text-white">
						Contact
					</Link>
					<Link href="/privacy" className="hover:text-white">
						Privacy Policy
					</Link>
				</div>

				{/* Newsletter & Social */}
				<div className="flex flex-col space-y-4">
					<h3 className="font-semibold text-white">Stay Updated</h3>
					<form className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
						<input
							type="email"
							placeholder="Enter your email"
							className="flex-1 rounded-md bg-gray-800 px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						<Button type="submit">Subscribe</Button>
					</form>
					<Separator />
					<div className="flex space-x-4">
						<Link href="https://twitter.com/yourprofile" aria-label="Twitter">
							<Twitter className="h-6 w-6 transition-colors hover:text-white" />
						</Link>
						{/* Add more social icons from Lucide as needed */}
					</div>
				</div>
			</div>
			<div className="mt-10 border-gray-700 border-t pt-6 text-center text-sm">
				© {new Date().getFullYear()} YourCompany. All rights reserved.
			</div>
		</footer>
	);
}

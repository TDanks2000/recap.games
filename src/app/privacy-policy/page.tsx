"use client";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
	return (
		<main className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-8 lg:px-12 xl:px-16">
			<header className="mb-12 text-center">
				<h1 className="font-extrabold text-4xl text-muted-foreground tracking-tight dark:text-white">
					Privacy Policy
				</h1>
				<p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
					Last updated: {format(new Date("05/01/2025"), "PPP")}
				</p>
			</header>

			<Separator className="my-8" />

			<article className="prose prose-lg dark:prose-invert space-y-12">
				{/* Introduction */}
				<section>
					<h2>Introduction</h2>
					<p>
						At <strong>recap.games</strong>, we value your privacy and are
						committed to safeguarding your personal information. This policy
						explains what data we collect, why we collect it, and how we use and
						protect it when you access our platform.
					</p>
				</section>

				{/* Information We Collect */}
				<section>
					<h2>Information We Collect</h2>

					<h3>Account Information</h3>
					<p>When you register or authenticate, we collect:</p>
					<ul className="list-disc pl-6">
						<li>Email address</li>
						<li>Securely hashed password (when using email/password)</li>
						<li>
							Discord profile data (ID, username, avatar) when you sign in via
							Discord OAuth
						</li>
						<li>User role (Admin) for access control</li>
					</ul>

					<h3>Cookies & Session Data</h3>
					<p>We use cookies and similar technologies to:</p>
					<ul className="list-disc pl-6">
						<li>Maintain your authentication session</li>
						<li>Remember your preferences and user settings</li>
					</ul>
				</section>

				{/* How We Use Your Information */}
				<section>
					<h2>How We Use Your Information</h2>
					<p>We process your data to:</p>
					<ul className="list-disc pl-6">
						<li>Authenticate and authorize your access via NextAuth</li>
						<li>
							Provide dashboard functionalities powered by tRPC & TanStack Query
						</li>
					</ul>
				</section>

				{/* Legal Basis & Data Retention */}
				<section>
					<h2>Legal Basis & Retention</h2>
					<p>Under GDPR and other applicable laws, we rely on:</p>
					<ul className="list-disc pl-6">
						<li>Performance of a contract for account management services</li>
						<li>Legitimate interests for platform security and improvement</li>
					</ul>
					<p>
						We retain personal data only as long as necessary to fulfill the
						purposes outlined in this policy or as required by law (e.g.,
						database backups).
					</p>
				</section>

				{/* Data Security */}
				<section>
					<h2>Data Security</h2>
					<p>We implement robust measures to protect your data:</p>
					<ul className="list-disc pl-6">
						<li>End-to-end encrypted connections (HTTPS/TLS)</li>
						<li>Secure password hashing algorithms (bcrypt)</li>
						<li>Access controls based on user roles</li>
					</ul>
				</section>

				{/* Third-Party Services */}
				<section>
					<h2>Third-Party Services</h2>
					<p>We leverage trusted providers for core services:</p>
					<ul className="list-disc pl-6">
						<li>
							<strong>NextAuth.js</strong> for authentication (Email/Password &
							Discord OAuth)
						</li>
						<li>
							<strong>Drizzle ORM</strong> backed by SQLite for database
							management
						</li>
					</ul>
					<p>
						Each provider has its own privacy policy that governs their handling
						of data.
					</p>
				</section>

				{/* Your Rights */}
				<section>
					<h2>Your Rights</h2>
					<p>You have the right to:</p>
					<ul className="list-disc pl-6">
						<li>Access and request a copy of your data</li>
						<li>Rectify or update inaccurate data</li>
						<li>Request deletion of your account and personal data</li>
						<li>Withdraw consent for non-essential processing</li>
					</ul>
				</section>

				{/* Contact Information */}
				<section>
					<h2>Contact Information</h2>
					<p>For privacy inquiries or to exercise your rights, email us at:</p>
					<p>
						<a
							href="mailto:privacy@recap.games"
							className="text-primary hover:underline"
						>
							privacy@recap.games
						</a>
					</p>
				</section>

				{/* Changes to This Policy */}
				<section>
					<h2>Changes to This Policy</h2>
					<p>
						We may update this policy periodically. We’ll post any changes here
						and update the "Last updated" date above.
					</p>
				</section>
			</article>
		</main>
	);
}

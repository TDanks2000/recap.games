import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SOCIAL_LINKS } from "@/lib/links";

const donationLinks = SOCIAL_LINKS.filter((link) => link.type === "donate");

export default function DonationsHeader() {
	return (
		<Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
			<CardHeader className="space-y-4 pb-8">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<CardTitle className="text-center font-bold text-4xl sm:text-5xl">
						Support the Project
					</CardTitle>
				</motion.div>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					<CardDescription className="mx-auto max-w-2xl text-center text-lg sm:text-xl">
						Your support helps keep the servers running and enables continuous
						improvements. Every contribution makes a difference!
					</CardDescription>
				</motion.div>
			</CardHeader>
			<CardContent className="pb-8">
				<motion.div
					className="flex flex-wrap justify-center gap-6"
					initial="hidden"
					animate="visible"
					variants={{
						visible: {
							transition: {
								staggerChildren: 0.1,
							},
						},
					}}
				>
					{donationLinks.map((link) => (
						<motion.div
							key={link.label}
							variants={{
								hidden: { opacity: 0, scale: 0.8 },
								visible: { opacity: 1, scale: 1 },
							}}
						>
							<Button
								asChild
								size="lg"
								variant="default"
								className="relative overflow-hidden transition-all hover:scale-105 hover:shadow-lg"
							>
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 px-4 py-1"
								>
									<link.icon className="h-5 w-5" />
									{link.label}
								</a>
							</Button>
						</motion.div>
					))}
				</motion.div>
			</CardContent>
		</Card>
	);
}

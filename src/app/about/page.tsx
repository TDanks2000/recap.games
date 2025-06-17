import { Coffee, Heart, HelpCircle, Users } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { faqItems } from "./items";

export default function AboutPage() {
	return (
		<main className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="space-y-20">
				<div className="space-y-5 text-center">
					<h1 className="font-bold text-4xl text-primary tracking-tight sm:text-5xl">
						About Recap.Games
					</h1>
					<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
						Your ultimate hub for the latest game announcements, trailers, and
						reveals from all major gaming showcases. No fluff, just the games.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
					<Card className="flex flex-col overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl">
						<CardHeader className="p-6">
							<div className="flex items-center gap-4">
								<div className="rounded-lg bg-primary/10 p-3">
									<Users className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="font-semibold text-2xl">
									Our Mission
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="flex-grow space-y-4 p-6 pt-0 text-base text-muted-foreground">
							<p>
								Recap.Games was born from a simple idea: to create a
								centralized, easy-to-navigate platform for all game
								announcements. We cut through the noise, bringing you curated
								content directly from the source.
							</p>
							<p>
								Whether it's a blockbuster AAA title or a hidden indie gem, if
								it's announced at a major showcase, you'll find it here. We're
								passionate gamers building for passionate gamers.
							</p>
						</CardContent>
					</Card>

					<Card className="flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-background to-background shadow-lg transition-shadow duration-300 hover:shadow-2xl">
						<CardHeader className="p-6">
							<div className="flex items-center gap-4">
								<div className="rounded-lg bg-primary/10 p-3">
									<Heart className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="font-semibold text-2xl">
									Support the Journey
								</CardTitle>
							</div>
							<CardDescription className="pt-2 text-sm">
								Recap.Games is a passion project. Your support helps keep the
								servers running and the game recaps flowing!
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-grow space-y-4 p-6 pt-0 text-base text-muted-foreground">
							<p>
								The best way to help is to spread the word. Share Recap.Games
								with your friends, on social media, or in your gaming
								communities. Every share makes a difference!
							</p>
							<p>
								If you'd like to do more, consider fueling those late-night
								coding sessions with a coffee.
							</p>
						</CardContent>
						<CardFooter className="p-6">
							<Button asChild size="lg" className="w-full">
								<a
									href="https://ko-fi.com/tdanks2000"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 text-base"
								>
									<Coffee className="h-5 w-5" />
									Buy me a coffee on Ko-fi
								</a>
							</Button>
						</CardFooter>
					</Card>
				</div>

				<div className="space-y-8">
					<div className="text-center">
						<h2 className="inline-flex items-center gap-4 font-bold text-3xl tracking-tight">
							<HelpCircle className="h-8 w-8 text-primary" />
							Frequently Asked Questions
						</h2>
					</div>
					<Accordion
						type="single"
						collapsible
						className="mx-auto w-full max-w-4xl space-y-4"
					>
						{faqItems.map((item) => (
							<AccordionItem
								value={item.id}
								key={item.id}
								className="overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
							>
								<AccordionTrigger className="flex w-full items-center justify-between px-6 py-5 text-left font-medium text-lg transition-colors hover:bg-primary/5 hover:no-underline">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="px-6 pt-2 pb-5 text-base text-muted-foreground">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</main>
	);
}

import { FaqAccordion } from "@/features/faq/components/faq-accordion";
import { HydrateClient } from "@/trpc/server";
import { faqItems } from "./items";

export default async function Faq() {
	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-start p-5 px-4 transition-all md:px-10">
				<h1 className="mt-8 mb-8 text-center font-bold text-3xl">
					Frequently Asked Questions
				</h1>
				<FaqAccordion items={faqItems} />
			</main>
		</HydrateClient>
	);
}

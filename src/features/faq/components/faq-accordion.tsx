import type { ReactNode } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
	question: string;
	answer: ReactNode;
	id: string;
}

interface FaqAccordionProps {
	items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
	return (
		<div className="mx-auto w-full max-w-3xl">
			<Accordion type="multiple" className="w-full">
				{items.map((item) => (
					<AccordionItem key={item.id} value={item.id}>
						<AccordionTrigger className="text-left font-medium">
							{item.question}
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}

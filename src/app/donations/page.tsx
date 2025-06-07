import DonationsList from "@/features/donations/components/donation-list";
import { api, HydrateClient } from "@/trpc/server";

export const metadata = {
	title: "Support the Project - Recap.Games",
	description:
		"Support Recap.Games and help us keep the servers running. Your contributions make a difference!",
};

export default async function Donations() {
	await api.donations.listAll.prefetch();

	return (
		<HydrateClient>
			<main className="container mx-auto flex min-h-screen flex-col items-center py-16 px-4 transition-all sm:px-6 lg:px-8">
				<div className="w-full max-w-7xl">
					<DonationsList />
				</div>
			</main>
		</HydrateClient>
	);
}

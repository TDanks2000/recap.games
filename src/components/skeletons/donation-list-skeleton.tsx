export default function DonationsListSkeleton() {
	return (
		<div className="w-full">
			<h2 className="mb-4 font-bold text-2xl">Recent Supporters</h2>
			<div className="flex animate-pulse flex-col gap-4">
				<div className="h-24 w-full rounded-lg bg-muted" />
				<div className="h-24 w-full rounded-lg bg-muted" />
				<div className="h-24 w-full rounded-lg bg-muted" />
			</div>
		</div>
	);
}

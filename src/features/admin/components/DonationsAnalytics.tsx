"use client";

import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export default function DonationsAnalytics() {
	const { data, isLoading, error } = api.donations.getAnalytics.useQuery();

	const currencyTotals = useMemo(() => {
		const totals = data?.totalAmountPerCurrency ?? {};
		return Object.entries(totals).sort(([a], [b]) => a.localeCompare(b));
	}, [data]);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeletons don't need keys
					<Card key={i} className="border-none">
						<CardHeader>
							<Skeleton className="h-4 w-24" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
				Failed to load analytics: {error.message}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* KPI Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card className="border-none">
					<CardHeader>
						<CardTitle className="text-muted-foreground text-sm">
							Total Donations
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-3xl">
							{data?.totalDonations ?? 0}
						</div>
					</CardContent>
				</Card>

				<Card className="border-none">
					<CardHeader>
						<CardTitle className="text-muted-foreground text-sm">
							Total Amount
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{currencyTotals.length === 0 ? (
							<p className="text-muted-foreground">No amounts yet</p>
						) : (
							currencyTotals.map(([currency, cents]) => (
								<div
									key={currency}
									className="flex items-center justify-between text-sm"
								>
									<span className="text-muted-foreground uppercase">
										{currency}
									</span>
									<span className="font-semibold">
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: currency.toUpperCase(),
										}).format((cents as number) / 100)}
									</span>
								</div>
							))
						)}
					</CardContent>
				</Card>

				<Card className="border-none">
					<CardHeader>
						<CardTitle className="text-muted-foreground text-sm">
							Top Currency
						</CardTitle>
					</CardHeader>
					<CardContent>
						{currencyTotals.length === 0 ? (
							<div className="text-muted-foreground">—</div>
						) : (
							(() => {
								const [topCurrency, topCents] = [...currencyTotals].sort(
									(a, b) => (b[1] as number) - (a[1] as number),
								)[0] as [string, number];
								return (
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground uppercase">
											{topCurrency}
										</span>
										<span className="font-bold text-xl">
											{new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: topCurrency.toUpperCase(),
											}).format(topCents / 100)}
										</span>
									</div>
								);
							})()
						)}
					</CardContent>
				</Card>
			</div>

			{/* Top Supporters */}
			<Card className="border-none">
				<CardHeader>
					<CardTitle>Top Supporters</CardTitle>
				</CardHeader>
				<CardContent>
					{data?.topDonators?.length ? (
						<div className="space-y-3">
							{data.topDonators.map((donator) => (
								<div key={donator.name} className="space-y-1">
									<div className="flex items-center justify-between">
										<span className="font-medium">{donator.name}</span>
									</div>
									<div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm">
										{Object.entries(donator.total)
											.sort(([a], [b]) => a.localeCompare(b))
											.map(([currency, cents]) => (
												<div
													key={`${donator.name}-${currency}`}
													className="flex items-center gap-2"
												>
													<span className="uppercase">{currency}</span>
													<span className="font-medium text-foreground">
														{new Intl.NumberFormat("en-US", {
															style: "currency",
															currency: currency.toUpperCase(),
														}).format((cents as number) / 100)}
													</span>
												</div>
											))}
									</div>
									<Separator className="my-2" />
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground">No supporters yet.</p>
					)}
				</CardContent>
			</Card>

			{/* Recent Donations */}
			<Card className="border-none">
				<CardHeader>
					<CardTitle>Recent Donations</CardTitle>
				</CardHeader>
				<CardContent>
					{data?.recentDonations?.length ? (
						<div className="space-y-3">
							{data.recentDonations.map((d) => (
								<div key={d.id} className="space-y-1">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<div className="font-medium">
												{d.donatorName} • {d.currency.toUpperCase()}{" "}
												{new Intl.NumberFormat("en-US", {
													style: "currency",
													currency: d.currency.toUpperCase(),
												}).format(d.amountInCents / 100)}
											</div>
											{d.donatorMessage && (
												<div className="text-muted-foreground text-sm">
													“{d.donatorMessage}”
												</div>
											)}
										</div>
										<div className="text-muted-foreground text-xs">
											via {d.provider} •{" "}
											{formatDistance(new Date(d.donatedAt), new Date(), {
												addSuffix: true,
											})}
										</div>
									</div>
									<Separator className="my-2" />
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground">No recent donations.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

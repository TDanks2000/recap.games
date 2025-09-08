"use client";

import { ArrowLeft, ListFilter, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonationsAnalytics from "@/features/admin/components/DonationsAnalytics";
import DonationsList from "@/features/admin/components/DonationsList";

export default function DonationsAdminPage() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<main className="mx-auto min-h-screen w-full max-w-screen-2xl">
			<div className="flex items-center justify-between py-6">
				<h1 className="font-bold text-2xl text-white sm:text-3xl">
					Donations Management
				</h1>
				<Button variant="outline" asChild className="gap-2">
					<Link href="/admin">
						<ArrowLeft className="h-4 w-4" />
						Back to Dashboard
					</Link>
				</Button>
			</div>

			<Tabs defaultValue="existing" className="w-full">
				<div className="mb-6 flex items-center gap-4">
					<TabsList>
						<TabsTrigger value="existing">Existing Donations</TabsTrigger>
						<TabsTrigger value="analytics" className="flex items-center">
							Analytics
							<Badge variant="secondary" className="ml-2 px-1.5 py-0.5">
								Beta
							</Badge>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="existing">
					<div className="mb-4 flex justify-end">
						<div className="relative w-full max-w-xs">
							<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search donations..."
								className="w-full border-none pl-9 text-white"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					<Card className="overflow-hidden rounded-lg border-none bg-transparent">
						<CardHeader className="rounded bg-card p-5">
							<div className="flex items-center justify-between">
								<CardTitle>All Donations</CardTitle>
								<Button variant="outline">
									<ListFilter />
									Filter
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<DonationsList searchQuery={searchQuery} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="analytics">
					<Card className="overflow-hidden rounded-lg border-none bg-transparent">
						<CardHeader className="rounded bg-card p-5">
							<CardTitle>Analytics</CardTitle>
						</CardHeader>
						<CardContent className="px-0 py-3">
							<DonationsAnalytics />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</main>
	);
}

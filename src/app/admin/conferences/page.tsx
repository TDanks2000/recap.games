"use client";

import { ArrowLeft, ListFilter, Minus, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConferenceForm from "@/features/admin/components/ConferenceForm";
import ConferencesList from "@/features/admin/components/ConferencesList";

export default function ConferencesAdminPage() {
	const [formCount, setFormCount] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const handleAddForm = () => setFormCount((prev) => prev + 1);
	const handleRemoveForm = () =>
		formCount > 1 && setFormCount((prev) => prev - 1);

	return (
		<main className="mx-auto min-h-screen w-full max-w-screen-2xl">
			{/* Top bar */}
			<div className="flex items-center justify-between py-6">
				<h1 className="font-bold text-2xl text-white sm:text-3xl">
					Conferences Management
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
						<TabsTrigger value="existing">Existing Conferences</TabsTrigger>
						<TabsTrigger value="add" className="flex items-center">
							Add New
							<Badge variant="secondary" className="ml-2 px-1.5 py-0.5">
								{formCount}
							</Badge>
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Existing Conferences Tab */}
				<TabsContent value="existing">
					<div className="mb-4 flex justify-end">
						<div className="relative w-full max-w-xs">
							<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search conferences..."
								className="w-full border-none pl-9 text-white"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					<Card className="overflow-hidden rounded-lg border-none bg-transparent">
						<CardHeader className="rounded bg-card p-5">
							<div className="flex items-center justify-between">
								<CardTitle>All Conferences</CardTitle>
								<Button variant="outline">
									<ListFilter />
									Filter
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<ConferencesList searchQuery={searchQuery} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Add New Conference Tab */}
				<TabsContent value="add">
					<div className="mb-4 flex justify-end gap-2">
						<Button variant="outline" size="sm" onClick={handleAddForm}>
							<Plus />
							Add Form
						</Button>
						{formCount > 1 && (
							<Button variant="outline" size="sm" onClick={handleRemoveForm}>
								<Minus />
								Remove Form
							</Button>
						)}
					</div>
					<div className="space-y-6">
						{Array.from({ length: formCount }).map((_, index) => (
							<Card
								// biome-ignore lint/suspicious/noArrayIndexKey: this is fine
								key={index}
								className="overflow-hidden rounded-lg border-none"
							>
								<CardHeader className="rounded bg-card p-5">
									<CardTitle>
										{formCount > 1
											? `Conference ${index + 1}`
											: "New Conference"}
									</CardTitle>
								</CardHeader>
								<CardContent className="w-full">
									<ConferenceForm formIndex={index} />
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</main>
	);
}

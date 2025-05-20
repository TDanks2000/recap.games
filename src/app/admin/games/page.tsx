"use client";

import { ArrowLeft, ListFilter, Minus, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameForm from "@/features/admin/components/GameForm";
import GamesList from "@/features/admin/components/GamesList";

export default function GamesAdminPage() {
	const [formCount, setFormCount] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const handleAddForm = () => setFormCount((prev) => prev + 1);
	const handleRemoveForm = () =>
		formCount > 1 && setFormCount((prev) => prev - 1);

	return (
		<main className="w-full max-w-screen-2xl mx-auto min-h-screen">
			{/* Top bar */}
			<div className="flex items-center justify-between py-6">
				<h1 className="font-bold text-2xl sm:text-3xl text-white">
					Games Management
				</h1>
				<Button variant="outline" asChild className="gap-2">
					<Link href="/admin">
						<ArrowLeft className="h-4 w-4" />
						Back to Dashboard
					</Link>
				</Button>
			</div>

			<Tabs defaultValue="existing" className="w-full">
				<div className="flex items-center gap-4 mb-6">
					<TabsList>
						<TabsTrigger value="existing">Existing Games</TabsTrigger>
						<TabsTrigger value="add" className="flex items-center">
							Add New
							<Badge variant="secondary" className="ml-2 px-1.5 py-0.5">
								{formCount}
							</Badge>
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Existing Games Tab */}
				<TabsContent value="existing">
					<div className="flex justify-end mb-4">
						<div className="relative w-full max-w-xs">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search games..."
								className="w-full pl-9 text-white border-none"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					<Card className="overflow-hidden rounded-lg border-none bg-transparent">
						<CardHeader className="p-5 rounded bg-card">
							<div className="flex items-center justify-between">
								<CardTitle>All Games</CardTitle>
								<Button variant="outline">
									<ListFilter />
									Filter
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-0 max-h-[75vh] overflow-y-auto">
							<GamesList searchQuery={searchQuery} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Add New Game Tab */}
				<TabsContent value="add">
					<div className="flex gap-2 justify-end mb-4">
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
								key={index}
								className="overflow-hidden rounded-lg border-none"
							>
								<CardHeader className="p-5 rounded bg-card">
									<CardTitle>
										{formCount > 1 ? `Game ${index + 1}` : "New Game"}
									</CardTitle>
								</CardHeader>
								<CardContent className="w-full max-h-[75vh] overflow-y-auto">
									<GameForm formIndex={index} />
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</main>
	);
}

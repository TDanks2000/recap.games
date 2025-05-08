"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GameForm from "@/features/admin/components/GameForm";
import GamesList from "@/features/admin/components/GamesList";

export default function GamesAdminPage() {
	const [formCount, setFormCount] = useState(1);

	const handleAddForm = () => setFormCount((prev) => prev + 1);
	const handleRemoveForm = () =>
		formCount > 1 && setFormCount((prev) => prev - 1);

	return (
		<main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
			<header className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
					Games Management
				</h1>
				<Button variant="outline" onClick={() => window.history.back()}>
					← Back to Dashboard
				</Button>
			</header>

			<Separator />

			<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Add Games Section */}
				<Card className="flex h-full flex-col">
					<CardHeader>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<CardTitle className="font-semibold text-xl">
								Add New Games
							</CardTitle>
							<div className="flex gap-2">
								<Button variant="outline" size="sm" onClick={handleAddForm}>
									+ Add Form
								</Button>
								{formCount > 1 && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleRemoveForm}
									>
										– Remove Form
									</Button>
								)}
							</div>
						</div>
					</CardHeader>
					<CardContent className="max-h-[75vh] space-y-6 overflow-y-auto pr-2">
						{Array.from({ length: formCount }).map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<div key={index} className="space-y-4">
								{index > 0 && <Separator />}
								<GameForm formIndex={index} />
							</div>
						))}
					</CardContent>
				</Card>

				{/* Games List Section */}
				<Card className="flex h-full flex-col">
					<CardHeader>
						<CardTitle className="font-semibold text-xl">
							Existing Games
						</CardTitle>
					</CardHeader>
					<CardContent className="max-h-[75vh] overflow-y-auto pr-2">
						<GamesList />
					</CardContent>
				</Card>
			</section>
		</main>
	);
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ConferenceForm from "@/features/admin/components/ConferenceForm";
import ConferencesList from "@/features/admin/components/ConferencesList";

export default function ConferencesAdminPage() {
	const [formCount, setFormCount] = useState(1);

	const handleAddForm = () => {
		setFormCount((prev) => prev + 1);
	};

	const handleRemoveForm = () => {
		if (formCount > 1) {
			setFormCount((prev) => prev - 1);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">Conferences Management</h2>
				<Button variant="outline" onClick={() => window.history.back()}>
					Back to Dashboard
				</Button>
			</div>
			<Separator />

			<div className="grid gap-6 md:grid-cols-2">
				{/* Add Conferences Section */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Add New Conferences</CardTitle>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleAddForm}
									className="text-xs"
								>
									Add Form
								</Button>
								{formCount > 1 && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleRemoveForm}
										className="text-xs"
									>
										Remove Form
									</Button>
								)}
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{Array.from({ length: formCount }).map((_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: safe
								<div key={index} className="space-y-4">
									{index > 0 && <Separator />}
									<ConferenceForm formIndex={index} />
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Conferences List Section */}
				<Card>
					<CardHeader>
						<CardTitle>Existing Conferences</CardTitle>
					</CardHeader>
					<CardContent>
						<ConferencesList />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

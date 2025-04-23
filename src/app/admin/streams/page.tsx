"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StreamForm from "@/features/admin/components/StreamForm";
import StreamsList from "@/features/admin/components/StreamsList";
import { useState } from "react";

export default function StreamsAdminPage() {
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
				<h2 className="font-bold text-2xl">Streams Management</h2>
				<Button variant="outline" onClick={() => window.history.back()}>
					Back to Dashboard
				</Button>
			</div>
			<Separator />

			<div className="grid gap-6 md:grid-cols-2">
				{/* Add Streams Section */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Add New Streams</CardTitle>
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
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={index} className="space-y-4">
									{index > 0 && <Separator />}
									<StreamForm formIndex={index} />
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Streams List Section */}
				<Card>
					<CardHeader>
						<CardTitle>Existing Streams</CardTitle>
					</CardHeader>
					<CardContent>
						<StreamsList />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameImportDialog } from "@/features/data-mapping/components/GameImportDialog";

export default function TestingPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
			<h1 className="mb-5 font-bold text-2xl text-white sm:text-3xl">
				Testing Page
			</h1>

			<Button onClick={() => setIsDialogOpen(true)}>
				Open Game Import Dialog
			</Button>

			<GameImportDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>
		</div>
	);
}

"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ConferencesList() {
	const utils = api.useUtils();
	const { data: conferences, isLoading } = api.conference.getAll.useQuery();
	const [conferenceToDelete, setConferenceToDelete] = useState<number | null>(
		null,
	);

	const deleteConferenceMutation = api.conference.delete.useMutation({
		onSuccess: () => {
			toast.success("Conference deleted successfully");
			utils.conference.getAll.invalidate();
		},
		onError: (error) => {
			toast.error(`Error deleting conference: ${error.message}`);
		},
	});

	const handleDelete = (id: number) => {
		setConferenceToDelete(id);
	};

	const confirmDelete = () => {
		if (conferenceToDelete !== null) {
			deleteConferenceMutation.mutate({ id: conferenceToDelete });
			setConferenceToDelete(null);
		}
	};

	const formatDate = (date: Date | null | undefined) => {
		if (!date) return "Not scheduled";
		return format(date, "MMM d, yyyy h:mm a");
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={i} className="space-y-2">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<Separator className="my-2" />
					</div>
				))}
			</div>
		);
	}

	if (!conferences || conferences.length === 0) {
		return <p className="text-muted-foreground">No conferences found.</p>;
	}

	return (
		<>
			<div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
				{conferences.map((conference) => (
					<div key={conference.id} className="space-y-2">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
							<div className="space-y-1">
								<h3 className="font-medium">{conference.name}</h3>
								<p className="text-muted-foreground text-sm">
									{formatDate(conference.startTime)}
									{conference.endTime && ` - ${formatDate(conference.endTime)}`}
								</p>
								<p className="text-muted-foreground text-xs">
									{conference.streams.length} streams •{" "}
									{conference.games.length} games
								</p>
							</div>
							<div className="flex gap-2 self-end sm:self-start">
								<Button variant="ghost" size="icon" asChild>
									<a
										href={`/admin/conferences/edit/${conference.id}`}
										aria-label={`Edit ${conference.name}`}
									>
										<Edit className="h-4 w-4" />
									</a>
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDelete(conference.id)}
									disabled={deleteConferenceMutation.isPending}
									aria-label={`Delete ${conference.name}`}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>

			<AlertDialog
				open={conferenceToDelete !== null}
				onOpenChange={(open) => !open && setConferenceToDelete(null)}
			>
				<AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							conference and all associated streams.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

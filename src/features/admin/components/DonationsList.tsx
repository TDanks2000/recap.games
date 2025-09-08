"use client";

import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

interface Props {
	searchQuery?: string;
}

export default function DonationsList({ searchQuery = "" }: Props) {
	const utils = api.useUtils();
	const { data: donations, isLoading } = api.donations.getAllAdmin.useQuery();

	const [donationToDelete, setDonationToDelete] = useState<string | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);

	const [formState, setFormState] = useState<{
		donatorName: string;
		donatorMessage: string;
		amount: string; // major units (e.g. 12.34)
		currency: string;
		donatedAt: string; // local datetime for input[type="datetime-local"]
	}>({
		donatorName: "",
		donatorMessage: "",
		amount: "",
		currency: "",
		donatedAt: "",
	});

	const deleteMutation = api.donations.delete.useMutation({
		onSuccess: () => {
			toast.success("Donation deleted successfully");
			utils.donations.getAllAdmin.invalidate();
		},
		onError: (error) =>
			toast.error(`Error deleting donation: ${error.message}`),
	});

	const updateMutation = api.donations.update.useMutation({
		onSuccess: () => {
			toast.success("Donation updated successfully");
			utils.donations.getAllAdmin.invalidate();
			setEditingId(null);
		},
		onError: (error) =>
			toast.error(`Error updating donation: ${error.message}`),
	});

	const toLocalDateTimeInputValue = (date: Date) => {
		const pad = (n: number) => String(n).padStart(2, "0");
		const y = date.getFullYear();
		const m = pad(date.getMonth() + 1);
		const d = pad(date.getDate());
		const h = pad(date.getHours());
		const min = pad(date.getMinutes());
		return `${y}-${m}-${d}T${h}:${min}`;
	};

	const handleEdit = (id: string) => {
		const donation = donations?.find((d) => d.id === id);
		if (!donation) return;
		setEditingId(id);
		setFormState({
			donatorName: donation.donatorName ?? "",
			donatorMessage: donation.donatorMessage ?? "",
			amount:
				donation.amountInCents != null
					? (donation.amountInCents / 100).toFixed(2)
					: "",
			currency: (donation.currency ?? "").toUpperCase(),
			donatedAt: donation.donatedAt
				? toLocalDateTimeInputValue(new Date(donation.donatedAt))
				: "",
		});
	};

	const handleUpdate = () => {
		if (!editingId) return;
		updateMutation.mutate({
			id: editingId,
			donatorName: formState.donatorName || undefined,
			donatorMessage: formState.donatorMessage || undefined,
			amountInCents:
				formState.amount.trim() === ""
					? undefined
					: Math.round(Number.parseFloat(formState.amount) * 100),
			currency: (formState.currency || undefined)?.toUpperCase(),
			donatedAt:
				formState.donatedAt.trim() === ""
					? undefined
					: new Date(formState.donatedAt),
		});
	};

	const handleDelete = (id: string) => setDonationToDelete(id);
	const confirmDelete = () => {
		if (donationToDelete) {
			deleteMutation.mutate({ id: donationToDelete });
			setDonationToDelete(null);
		}
	};

	const filtered = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return donations ?? [];
		return (donations ?? []).filter((d) =>
			[d.donatorName, d.donatorMessage, d.currency, d.provider]
				.filter(Boolean)
				.some((v) => String(v).toLowerCase().includes(q)),
		);
	}, [donations, searchQuery]);

	const formatDateTime = (date: Date | null | undefined) => {
		if (!date) return "";
		return format(date, "MMM d, yyyy h:mm a");
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={`donation-skeleton-${
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
							i
						}`}
						className="space-y-2"
					>
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
						<Separator className="my-2" />
					</div>
				))}
			</div>
		);
	}

	if (!filtered || filtered.length === 0) {
		return <p className="text-muted-foreground">No donations found.</p>;
	}

	return (
		<>
			<div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
				{filtered.map((donation) => (
					<div key={donation.id} className="space-y-2">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
							<div className="space-y-1">
								<h3 className="font-medium">
									{donation.donatorName} • {donation.currency.toUpperCase()}{" "}
									{(donation.amountInCents / 100).toFixed(2)}
								</h3>
								<p className="text-muted-foreground text-sm">
									{formatDateTime(donation.donatedAt)} • via {donation.provider}
								</p>
								{donation.donatorMessage && (
									<p className="text-muted-foreground text-xs">
										“{donation.donatorMessage}”
									</p>
								)}
							</div>
							<div className="flex gap-2 self-end sm:self-start">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleEdit(donation.id)}
								>
									<Edit className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => handleDelete(donation.id)}
									disabled={deleteMutation.isPending}
									aria-label={`Delete donation ${donation.id}`}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</div>
						<Separator className="my-2" />
					</div>
				))}
			</div>

			{/* Edit dialog */}
			<Dialog
				open={editingId !== null}
				onOpenChange={(open) => !open && setEditingId(null)}
			>
				<DialogContent className="max-w-[90vw] sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Edit Donation</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<Label htmlFor="donatorName">Donator Name</Label>
							<Input
								id="donatorName"
								value={formState.donatorName}
								onChange={(e) =>
									setFormState((s) => ({ ...s, donatorName: e.target.value }))
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="donatorMessage">Message</Label>
							<Textarea
								id="donatorMessage"
								value={formState.donatorMessage}
								onChange={(e) =>
									setFormState((s) => ({
										...s,
										donatorMessage: e.target.value,
									}))
								}
							/>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="amount">Amount</Label>
								<Input
									id="amount"
									type="number"
									inputMode="decimal"
									step="0.01"
									min="0"
									placeholder="0.00"
									value={formState.amount}
									onChange={(e) =>
										setFormState((s) => ({
											...s,
											amount: e.target.value,
										}))
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="currency">Currency</Label>
								<Input
									id="currency"
									value={formState.currency}
									onChange={(e) =>
										setFormState((s) => ({
											...s,
											currency: e.target.value.toUpperCase(),
										}))
									}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="donatedAt">Donated At</Label>
							<Input
								id="donatedAt"
								type="datetime-local"
								className="w-full"
								value={formState.donatedAt}
								onChange={(e) =>
									setFormState((s) => ({ ...s, donatedAt: e.target.value }))
								}
							/>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setEditingId(null)}>
							Cancel
						</Button>
						<Button onClick={handleUpdate} disabled={updateMutation.isPending}>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Delete dialog */}
			<AlertDialog
				open={donationToDelete !== null}
				onOpenChange={(open) => !open && setDonationToDelete(null)}
			>
				<AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							donation.
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

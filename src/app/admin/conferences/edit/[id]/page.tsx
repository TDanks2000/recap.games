"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";

const conferenceFormSchema = z.object({
	name: z.string().min(1, { message: "Conference name is required" }),
	startTime: z.string().optional(),
	endTime: z.string().optional(),
});

type ConferenceFormValues = z.infer<typeof conferenceFormSchema>;

export default function EditConferencePage() {
	const params = useParams();
	const router = useRouter();
	const conferenceId = Number(params.id);

	const utils = api.useUtils();

	// Fetch the conference data
	const {
		data: conference,
		isLoading,
		error,
	} = api.conference.getById.useQuery(
		{ id: conferenceId },
		{
			enabled: !Number.isNaN(conferenceId),
			retry: false,
		},
	);

	// Update conference mutation
	const updateConferenceMutation = api.conference.update.useMutation({
		onSuccess: () => {
			toast.success("Conference updated successfully");
			utils.conference.getAll.invalidate();
			router.push("/admin/conferences");
		},
		onError: (error) => {
			toast.error(`Error updating conference: ${error.message}`);
		},
	});

	const form = useForm<ConferenceFormValues>({
		resolver: zodResolver(conferenceFormSchema),
		defaultValues: {
			name: "",
			startTime: "",
			endTime: "",
		},
	});

	// Update form values when conference data is loaded
	useEffect(() => {
		if (conference) {
			form.reset({
				name: conference.name,
				startTime: conference.startTime
					? new Date(conference.startTime).toISOString().slice(0, 16)
					: undefined,
				endTime: conference.endTime
					? new Date(conference.endTime).toISOString().slice(0, 16)
					: undefined,
			});
		}
	}, [conference, form]);

	function onSubmit(data: ConferenceFormValues) {
		// Convert string dates to Date objects if provided
		const startTime = data.startTime ? new Date(data.startTime) : undefined;
		const endTime = data.endTime ? new Date(data.endTime) : undefined;

		updateConferenceMutation.mutate({
			id: conferenceId,
			name: data.name,
			startTime,
			endTime,
		});
	}

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl">Edit Conference</h2>
					<Button
						variant="outline"
						onClick={() => router.push("/admin/conferences")}
					>
						Back to Conferences
					</Button>
				</div>
				<Separator />
				<div className="flex items-center justify-center p-12">
					<p>Loading conference data...</p>
				</div>
			</div>
		);
	}

	if (error || !conference) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl">Edit Conference</h2>
					<Button
						variant="outline"
						onClick={() => router.push("/admin/conferences")}
					>
						Back to Conferences
					</Button>
				</div>
				<Separator />
				<Card>
					<CardContent className="p-6">
						<p className="text-red-500">
							Error loading conference:{" "}
							{error?.message || "Conference not found"}
						</p>
						<Button
							className="mt-4"
							onClick={() => router.push("/admin/conferences")}
						>
							Return to Conferences
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">Edit Conference</h2>
				<Button
					variant="outline"
					onClick={() => router.push("/admin/conferences")}
				>
					Back to Conferences
				</Button>
			</div>
			<Separator />

			<Card>
				<CardHeader>
					<CardTitle>Edit {conference.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="space-y-6">
								{/* Conference Name */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="flex min-h-20 flex-col justify-start">
											<FormLabel className="mb-2">Conference Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Nintendo, Ubisoft, Xbox, etc."
													className="w-full"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>

								<div className="grid gap-6 md:grid-cols-2">
									{/* Start Time */}
									<FormField
										control={form.control}
										name="startTime"
										render={({ field }) => (
											<FormItem className="flex min-h-20 flex-col justify-start">
												<FormLabel className="mb-2">Start Time</FormLabel>
												<FormControl>
													<Input
														type="datetime-local"
														className="w-full"
														{...field}
													/>
												</FormControl>
												<FormDescription className="text-xs">
													When the conference begins
												</FormDescription>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>

									{/* End Time */}
									<FormField
										control={form.control}
										name="endTime"
										render={({ field }) => (
											<FormItem className="flex min-h-20 flex-col justify-start">
												<FormLabel className="mb-2">End Time</FormLabel>
												<FormControl>
													<Input
														type="datetime-local"
														className="w-full"
														{...field}
													/>
												</FormControl>
												<FormDescription className="text-xs">
													When the conference ends
												</FormDescription>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="flex justify-end pt-6">
								<Button
									type="submit"
									disabled={updateConferenceMutation.isPending}
									className="relative min-w-[120px]"
								>
									{updateConferenceMutation.isPending ? (
										<>
											<span className="opacity-0">Update Conference</span>
											<span className="absolute inset-0 flex items-center justify-center">
												Updating...
											</span>
										</>
									) : (
										"Update Conference"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Streams Section */}
			<Card>
				<CardHeader>
					<CardTitle>Associated Streams</CardTitle>
				</CardHeader>
				<CardContent>
					{conference?.streams?.length > 0 ? (
						<div className="space-y-4">
							{conference.streams.map((stream) => (
								<div key={stream.id} className="rounded-md border p-4">
									<h3 className="font-medium">{stream.title}</h3>
									<p className="text-muted-foreground text-sm">
										<a
											href={stream.link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 hover:underline"
										>
											{stream.link}
										</a>
									</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground">
							No streams associated with this conference.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

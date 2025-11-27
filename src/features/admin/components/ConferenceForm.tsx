"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DateTimePicker } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

const conferenceFormSchema = z
	.object({
		conference: z.object({
			name: z.string().min(1, { message: "Conference name is required" }),
			startTime: z.date().optional(),
			endTime: z.date().optional(),
			year: z.number().min(1900).max(2100),
		}),
		stream: z.object({
			title: z.string().min(1, { message: "Stream title is required" }),
			link: z.string().url({ message: "Please enter a valid URL" }),
		}),
	})
	.superRefine((data, ctx) => {
		const { startTime, endTime } = data.conference;

		if (startTime && !endTime) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "End Time is required if Start Time is set.",
				path: ["conference", "endTime"],
			});
		}

		if (!startTime && endTime) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Start Time is required if End Time is set.",
				path: ["conference", "startTime"],
			});
		}

		if (startTime && endTime && endTime <= startTime) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "End Time must be after Start Time.",
				path: ["conference", "endTime"],
			});
		}

		if (startTime && endTime) {
			const minDurationMs = 5 * 60 * 1000;
			if (endTime.getTime() - startTime.getTime() < minDurationMs) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Conference must be at least ${minDurationMs / (60 * 1000)} minutes long.`,
					path: ["conference", "endTime"],
				});
			}
		}
	});

type ConferenceFormValues = z.infer<typeof conferenceFormSchema>;

// biome-ignore lint/correctness/noUnusedFunctionParameters: add formIndex back later
export default function ConferenceForm({ formIndex }: { formIndex: number }) {
	const utils = api.useUtils();

	const [showConfirmation, setShowConfirmation] = useState(false);
	const [countdown, setCountdown] = useState(3);
	const [resetTimeoutId, setResetTimeoutId] = useState<NodeJS.Timeout | null>(
		null,
	);

	const [isStreamSectionOpen, setIsStreamSectionOpen] = useState(true);

	const createConferenceMutation =
		api.combined.createConferenceWithStream.useMutation({
			onSuccess: (data) => {
				setShowConfirmation(true);
				setCountdown(3);

				const id = setInterval(() => {
					setCountdown((prev) => {
						if (prev <= 1) {
							clearInterval(id);
							setShowConfirmation(false);
							form.reset({
								conference: {
									name: "",
									startTime: new Date(),
									endTime: undefined,
									year: new Date().getFullYear(),
								},
								stream: {
									title: "",
									link: "",
								},
							});
							setEndTimeManuallyEdited(false);
							utils.conference.getAll.invalidate();
							return 0;
						}
						return prev - 1;
					});
				}, 1000);
				setResetTimeoutId(id);

				toast.success(
					`Conference "${data.conference.name}" created! Form clearing in ${countdown}s...`,
					{
						duration: 3000,
						onDismiss: () => {
							if (resetTimeoutId) clearInterval(resetTimeoutId);
							setShowConfirmation(false);
							form.reset({
								conference: {
									name: "",
									startTime: new Date(),
									endTime: undefined,
									year: new Date().getFullYear(),
								},
								stream: {
									title: "",
									link: "",
								},
							});
							setEndTimeManuallyEdited(false);
							utils.conference.getAll.invalidate();
						},
						action: {
							label: "Dismiss Now",
							onClick: () => {
								if (resetTimeoutId) clearInterval(resetTimeoutId);
								setShowConfirmation(false);
								form.reset({
									conference: {
										name: "",
										startTime: new Date(),
										endTime: undefined,
										year: new Date().getFullYear(),
									},
									stream: {
										title: "",
										link: "",
									},
								});
								setEndTimeManuallyEdited(false);
								utils.conference.getAll.invalidate();
							},
						},
					},
				);
			},
			onError: (error) => {
				toast.error(`Failed to create conference: ${error.message}`);
			},
		});

	const form = useForm<ConferenceFormValues>({
		resolver: zodResolver(conferenceFormSchema),
		defaultValues: {
			conference: {
				name: "",
				startTime: new Date(),
				endTime: undefined,
				year: new Date().getFullYear(),
			},
			stream: {
				title: "",
				link: "",
			},
		},
		mode: "onBlur",
	});

	const [endTimeManuallyEdited, setEndTimeManuallyEdited] = useState(false);

	const startTime = form.watch("conference.startTime");

	useEffect(() => {
		if (startTime && !endTimeManuallyEdited) {
			const currentEndTime = form.getValues("conference.endTime");

			if (
				!currentEndTime ||
				(currentEndTime &&
					Math.abs(
						currentEndTime.getTime() - startTime.getTime() - 30 * 60 * 1000,
					) > 1000)
			) {
				const newEndTime = new Date(startTime.getTime() + 30 * 60 * 1000);
				form.setValue("conference.endTime", newEndTime, {
					shouldValidate: true,
				});
			}
		} else if (!startTime && !endTimeManuallyEdited) {
			form.setValue("conference.endTime", undefined, { shouldValidate: true });
		}
	}, [startTime, form, endTimeManuallyEdited]);

	const handleResetEndTime = () => {
		form.setValue("conference.endTime", undefined, { shouldValidate: true });
		setEndTimeManuallyEdited(false);
		if (startTime) {
			const newEndTime = new Date(startTime.getTime() + 30 * 60 * 1000);
			form.setValue("conference.endTime", newEndTime, { shouldValidate: true });
		}
	};

	function onSubmit(data: ConferenceFormValues) {
		if (!data.conference.startTime || !data.conference.endTime) {
			toast.error("Please ensure both Start Time and End Time are provided.");
			return;
		}

		createConferenceMutation.mutate({
			conference: {
				name: data.conference.name,
				startTime: data.conference.startTime,
				endTime: data.conference.endTime,
				year: data.conference.year,
			},
			stream: data.stream,
		});
	}

	const formErrors = form.formState.errors;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto space-y-8 rounded-lg"
			>
				<div className="space-y-6">
					<div className="space-y-4">
						<h3 className="font-semibold text-xl tracking-tight">
							Conference Details
						</h3>
						<FormField
							control={form.control}
							name="conference.name"
							render={({ field }) => (
								<FormItem className="flex min-h-20 flex-col justify-start">
									<div className="mb-2 flex min-h-[24px] items-center">
										<FormLabel>Conference Name</FormLabel>
									</div>
									<FormControl>
										<Input
											placeholder="Nintendo, Ubisoft, Xbox, etc."
											className={
												formErrors.conference?.name ? "border-destructive" : ""
											}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="conference.year"
							render={({ field }) => (
								<FormItem className="flex min-h-20 flex-col justify-start">
									<div className="mb-2 flex min-h-[24px] items-center">
										<FormLabel>Year</FormLabel>
									</div>
									<FormControl>
										<Input
											type="number"
											placeholder="2024"
											className={
												formErrors.conference?.year ? "border-destructive" : ""
											}
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormDescription className="text-xs">
										The year of the conference
									</FormDescription>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<div className="grid gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="conference.startTime"
								render={({ field }) => (
									<FormItem className="flex min-h-20 flex-col justify-start">
										<div className="mb-2 flex min-h-[24px] items-center">
											<FormLabel>Start Time</FormLabel>
										</div>
										<FormControl>
											<DateTimePicker
												value={field.value}
												onValueChange={(date) => {
													field.onChange(date);
												}}
												className={
													formErrors.conference?.startTime
														? "border-destructive"
														: ""
												}
											/>
										</FormControl>
										{!endTimeManuallyEdited && (
											<FormDescription className="mt-2 text-xs">
												When the conference begins (end time will auto-fill)
											</FormDescription>
										)}
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="conference.endTime"
								render={({ field }) => (
									<FormItem className="flex min-h-20 flex-col justify-start">
										<div className="mb-2 flex min-h-[24px] items-center gap-2">
											<FormLabel>End Time</FormLabel>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={handleResetEndTime}
												className={`h-6 w-6 ${endTimeManuallyEdited ? "" : "invisible"}`}
												title="Reset End Time to auto-fill"
											>
												<RefreshCcw className="h-4 w-4" />
												<span className="sr-only">Reset End Time</span>
											</Button>
										</div>
										<FormControl>
											<DateTimePicker
												value={field.value}
												onValueChange={(date) => {
													field.onChange(date);
													if (date) {
														setEndTimeManuallyEdited(true);
													} else {
														setEndTimeManuallyEdited(false);
													}
												}}
												className={
													formErrors.conference?.endTime
														? "border-destructive"
														: ""
												}
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

					<Separator className="my-6" />

					<Collapsible
						open={isStreamSectionOpen}
						onOpenChange={setIsStreamSectionOpen}
						className="space-y-4"
					>
						<CollapsibleTrigger asChild>
							<div className="flex cursor-pointer items-center justify-between">
								<h3 className="font-semibold text-xl tracking-tight">
									Stream Details
								</h3>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="w-9 p-0"
								>
									<ChevronDown
										className={`h-4 w-4 transition-transform ${isStreamSectionOpen ? "rotate-180" : ""}`}
									/>
									<span className="sr-only">Toggle Stream Details</span>
								</Button>
							</div>
						</CollapsibleTrigger>
						<CollapsibleContent className="space-y-4">
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="stream.title"
									render={({ field }) => (
										<FormItem className="flex min-h-20 flex-col justify-start">
											<div className="mb-2 flex min-h-[24px] items-center">
												<FormLabel>Stream Title</FormLabel>
											</div>
											<FormControl>
												<Input
													placeholder="Official Stream"
													className={
														formErrors.stream?.title ? "border-destructive" : ""
													}
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="stream.link"
									render={({ field }) => (
										<FormItem className="flex min-h-20 flex-col justify-start">
											<div className="mb-2 flex min-h-[24px] items-center">
												<FormLabel>Stream URL</FormLabel>
											</div>
											<FormControl>
												<Input
													placeholder="https://youtube.com/watch?v=..."
													className={
														formErrors.stream?.link ? "border-destructive" : ""
													}
													{...field}
												/>
											</FormControl>
											<FormDescription className="text-xs">
												YouTube, Twitch, or other streaming platform URL
											</FormDescription>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>
							</div>
						</CollapsibleContent>
					</Collapsible>
				</div>

				<div className="flex justify-end pt-6">
					<Button
						type="submit"
						disabled={createConferenceMutation.isPending || showConfirmation}
						className="relative min-w-[120px]"
					>
						{createConferenceMutation.isPending ? (
							<>
								<span className="opacity-0">Save Conference</span>
								<span className="absolute inset-0 flex items-center justify-center">
									Saving...
								</span>
							</>
						) : showConfirmation ? (
							`Clearing... ${countdown}s`
						) : (
							"Save Conference"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

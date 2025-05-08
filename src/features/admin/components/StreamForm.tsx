"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";

const streamFormSchema = z.object({
	title: z.string().min(1, { message: "Stream title is required" }),
	link: z.string().url({ message: "Please enter a valid URL" }),
	conferenceId: z.number({
		required_error: "Please select a conference",
		invalid_type_error: "Please select a conference",
	}),
});

type StreamFormValues = z.infer<typeof streamFormSchema>;

interface StreamFormProps {
	formIndex: number;
}

export default function StreamForm({ formIndex }: StreamFormProps) {
	const utils = api.useUtils();
	const { data: conferences, isLoading: isLoadingConferences } =
		api.conference.getAll.useQuery();

	const createStreamMutation = api.stream.create.useMutation({
		onSuccess: () => {
			toast.success("Stream created successfully");
			form.reset();
			utils.stream.getAll.invalidate();
		},
		onError: (error) => {
			toast.error(`Error creating stream: ${error.message}`);
		},
	});

	const form = useForm<StreamFormValues>({
		resolver: zodResolver(streamFormSchema),
		defaultValues: {
			title: "",
			link: "",
		},
	});

	function onSubmit(data: StreamFormValues) {
		createStreamMutation.mutate({
			title: data.title,
			link: data.link,
			conferenceId: data.conferenceId,
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto max-w-2xl space-y-8 rounded-lg bg-card p-6 shadow-sm"
			>
				<div className="space-y-6">
					<div className="space-y-4">
						<h3 className="font-semibold text-xl tracking-tight">
							Stream Details
						</h3>
						<div className="grid gap-6 md:grid-cols-2">
							{/* Stream Title */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="flex min-h-20 flex-col justify-start">
										<FormLabel className="mb-2">Stream Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Official Stream"
												className="w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							{/* Stream Link */}
							<FormField
								control={form.control}
								name="link"
								render={({ field }) => (
									<FormItem className="flex min-h-20 flex-col justify-start">
										<FormLabel className="mb-2">Stream URL</FormLabel>
										<FormControl>
											<Input
												placeholder="https://youtube.com/watch?v=..."
												className="w-full"
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

							{/* Conference */}
							<FormField
								control={form.control}
								name="conferenceId"
								render={({ field }) => (
									<FormItem className="md:col-span-2">
										<FormLabel className="mb-2">Conference</FormLabel>
										<Select
											onValueChange={(value) => field.onChange(Number(value))}
											defaultValue={field.value?.toString()}
											disabled={isLoadingConferences}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a conference" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{conferences?.map((conference) => (
													<SelectItem
														key={conference.id}
														value={conference.id.toString()}
													>
														{conference.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription className="text-xs">
											Associate with a conference
										</FormDescription>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="flex justify-end pt-6">
					<Button
						type="submit"
						disabled={createStreamMutation.isPending}
						className="relative min-w-[120px]"
					>
						{createStreamMutation.isPending ? (
							<>
								<span className="opacity-0">Save Stream</span>
								<span className="absolute inset-0 flex items-center justify-center">
									Saving...
								</span>
							</>
						) : (
							"Save Stream"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

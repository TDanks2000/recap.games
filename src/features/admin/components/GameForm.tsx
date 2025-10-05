"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { type Control, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Feature, Genre, MediaType, Platform } from "@/@types/db";
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
import { MultiSelect } from "@/components/ui/multi-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api, type RouterOutputs } from "@/trpc/react";

type Conference = RouterOutputs["conference"]["getAll"][number];

const mediaSchema = z.object({
	type: z.nativeEnum(MediaType),
	link: z.string().url({ message: "Please enter a valid URL" }),
});

const gameFormSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	releaseDate: z.string().optional(),
	genres: z.array(z.nativeEnum(Genre)).optional(),
	exclusive: z.array(z.nativeEnum(Platform)).optional(),
	features: z.array(z.nativeEnum(Feature)).optional(),
	developer: z.array(z.string()).optional(),
	publisher: z.array(z.string()).optional(),
	hidden: z.boolean().optional(),
	conferenceId: z.number().optional(),
	media: z
		.array(mediaSchema)
		.min(1, { message: "At least one media item is required" }),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

export interface GameFormInitialData {
	title?: string;
	releaseDate?: string;
	genres?: Genre[];
	exclusive?: Platform[];
	features?: Feature[];
	developer?: string[];
	publisher?: string[];
	hidden?: boolean;
	conference?: Conference;
	media?: Array<{ type: MediaType; link: string }>;
}

interface GameFormProps {
	formIndex: number;
	initialData?: GameFormInitialData;
	onFormSubmitSuccess?: () => void;
}

const formFieldConfigs = {
	title: {
		label: "Title",
		description: "The name of the game. This field is required.",
		placeholder: "Game title",
	},
	releaseDate: {
		label: "Release Date",
		description:
			'Optional. Enter the release date in MM-DD-YYYY format or use text like "Q4 2023".',
		placeholder: "Release date",
	},
	genres: {
		label: "Genres",
		description: "Optional. Select one or more genres that describe the game.",
		placeholder: "Select genres",
	},
	exclusive: {
		label: "Exclusive Platforms",
		description:
			"Optional. Select the platforms where the game is exclusively available.",
		placeholder: "Select platforms",
	},
	features: {
		label: "Features",
		description:
			"Optional. Select the features that the game supports (e.g., multiplayer, VR).",
		placeholder: "Select features",
	},
	developer: {
		label: "Developer",
		description: "Optional. Enter a comma-separated list of developer names.",
		placeholder: "Developer names",
	},
	publisher: {
		label: "Publisher",
		description: "Optional. Enter a comma-separated list of publisher names.",
		placeholder: "Publisher names",
	},
	conference: {
		label: "Conference",
		description: "Optional. Associate the game with a conference.",
		placeholder: "Select a conference",
	},
} as const;

// Helper components
const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => (
	<FormItem className="flex min-h-20 flex-col justify-start">
		{children}
	</FormItem>
);

interface BasicFormFieldProps {
	name: "title" | "releaseDate";
	config: (typeof formFieldConfigs)[keyof typeof formFieldConfigs];
	control: Control<GameFormValues>;
}

const BasicFormField = ({ name, config, control }: BasicFormFieldProps) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormFieldWrapper>
				<FormLabel>{config.label}</FormLabel>
				<FormDescription className="mb-2">{config.description}</FormDescription>
				<FormControl>
					<Input
						placeholder={config.placeholder}
						{...field}
						value={field.value || ""}
					/>
				</FormControl>
				<FormMessage />
			</FormFieldWrapper>
		)}
	/>
);

interface MultiSelectFieldProps {
	name: "genres" | "exclusive" | "features";
	config: (typeof formFieldConfigs)[keyof typeof formFieldConfigs];
	options: readonly string[];
	optionsGroupLabel: string;
	control: Control<GameFormValues>;
}

const MultiSelectField = ({
	name,
	config,
	options,
	optionsGroupLabel,
	control,
}: MultiSelectFieldProps) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormFieldWrapper>
				<FormLabel>{config.label}</FormLabel>
				<FormDescription className="mb-2">{config.description}</FormDescription>
				<FormControl>
					<MultiSelect
						options={options.map((option) => ({
							label: option,
							value: option,
						}))}
						selected={field.value || []}
						onChange={field.onChange}
						placeholder={config.placeholder}
						showFullSelected={true}
						selectedBadgeDisplay="whole"
						optionsGroupLabel={optionsGroupLabel}
					/>
				</FormControl>
				<FormMessage />
			</FormFieldWrapper>
		)}
	/>
);

interface ArrayInputFieldProps {
	name: "developer" | "publisher";
	config: (typeof formFieldConfigs)[keyof typeof formFieldConfigs];
	control: Control<GameFormValues>;
}

const ArrayInputField = ({ name, config, control }: ArrayInputFieldProps) => {
	const handleArrayInput = (
		value: string,
		onChange: (value: string[]) => void,
	) => {
		if (!value.trim()) {
			onChange([]);
			return;
		}
		onChange(value.split(",").map((item) => item.trim()));
	};

	const arrayToString = (array?: string[]) => array?.join(", ") ?? "";

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormFieldWrapper>
					<FormLabel>{config.label}</FormLabel>
					<FormDescription className="mb-2">
						{config.description}
					</FormDescription>
					<FormControl>
						<Input
							placeholder={config.placeholder}
							value={arrayToString(field.value)}
							onChange={(e) => handleArrayInput(e.target.value, field.onChange)}
						/>
					</FormControl>
					<FormMessage />
				</FormFieldWrapper>
			)}
		/>
	);
};

interface MediaItemProps {
	control: Control<GameFormValues>;
	index: number;
	onRemove: () => void;
	canRemove: boolean;
}

const MediaItem = ({ control, index, onRemove, canRemove }: MediaItemProps) => (
	<div className="flex items-start gap-4">
		<div className="grid flex-1 gap-x-6 gap-y-4 md:grid-cols-[auto_1fr]">
			<FormField
				control={control}
				name={`media.${index}.type`}
				render={({ field }) => (
					<FormFieldWrapper>
						<FormLabel>Media Type</FormLabel>
						<FormDescription className="mb-2">
							Required. Select the type of media (e.g., video, image).
						</FormDescription>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select media type" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{Object.values(MediaType).map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormFieldWrapper>
				)}
			/>
			<FormField
				control={control}
				name={`media.${index}.link`}
				render={({ field }) => (
					<FormFieldWrapper>
						<FormLabel>Media URL</FormLabel>
						<FormDescription className="mb-2">
							Required. Provide a valid URL for the media item.
						</FormDescription>
						<FormControl>
							<Input placeholder="https://example.com/media" {...field} />
						</FormControl>
						<FormMessage />
					</FormFieldWrapper>
				)}
			/>
		</div>
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className="mt-8"
			onClick={onRemove}
			disabled={!canRemove}
		>
			<Trash2 className="h-4 w-4" />
		</Button>
	</div>
);

export default function GameForm({
	formIndex,
	initialData,
	onFormSubmitSuccess,
}: GameFormProps) {
	const utils = api.useUtils();
	const { data: conferences, isLoading: conferencesLoading } =
		api.conference.getAll.useQuery();

	// Calculate default values
	const defaultFormValues = useMemo((): GameFormValues => {
		const baseDefaults: GameFormValues = {
			title: "",
			releaseDate: "",
			genres: [],
			exclusive: [],
			features: [],
			developer: [],
			publisher: [],
			hidden: false,
			media: [{ type: MediaType.Video, link: "" }],
			conferenceId: undefined,
		};

		if (!initialData) return baseDefaults;

		return {
			...baseDefaults,
			...initialData,
			media:
				initialData.media && initialData.media.length > 0
					? initialData.media
					: baseDefaults.media,
			conferenceId: initialData.conference?.id,
		};
	}, [initialData]);

	const form = useForm<GameFormValues>({
		resolver: zodResolver(gameFormSchema),
		defaultValues: defaultFormValues,
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "media",
	});

	const createGameMutation = api.combined.createGameWithMedia.useMutation({
		onSuccess: () => {
			toast.success(`Game created successfully (Form ${formIndex})`);
			form.reset({
				title: "",
				releaseDate: "",
				genres: [],
				exclusive: [],
				features: [],
				developer: [],
				publisher: [],
				hidden: false,
				media: [{ type: MediaType.Video, link: "" }],
				conferenceId: undefined,
			});
			void utils.game.getAll.invalidate();
			onFormSubmitSuccess?.();
		},
		onError: (error) => {
			toast.error(`Error creating game (Form ${formIndex}): ${error.message}`);
		},
	});

	useEffect(() => {
		form.reset(defaultFormValues);
	}, [defaultFormValues, form]);

	const onSubmit = (data: GameFormValues) => {
		createGameMutation.mutate({
			game: {
				title: data.title,
				releaseDate: data.releaseDate,
				genres: data.genres,
				exclusive: data.exclusive,
				features: data.features,
				developer: data.developer,
				publisher: data.publisher,
				hidden: data.hidden,
				conferenceId: data.conferenceId,
			},
			media: data.media,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-8">
					{/* Basic Details */}
					<div className="space-y-4">
						<h3 className="font-semibold text-xl tracking-tight">
							Basic Details
						</h3>
						<div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
							<BasicFormField
								name="title"
								config={formFieldConfigs.title}
								control={form.control}
							/>
							<BasicFormField
								name="releaseDate"
								config={formFieldConfigs.releaseDate}
								control={form.control}
							/>
						</div>
					</div>

					{/* Game Details */}
					<div className="space-y-4">
						<h3 className="font-semibold text-xl tracking-tight">
							Game Details
						</h3>
						<div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
							<MultiSelectField
								name="genres"
								config={formFieldConfigs.genres}
								options={Object.values(Genre)}
								optionsGroupLabel="Genres"
								control={form.control}
							/>
							<MultiSelectField
								name="exclusive"
								config={formFieldConfigs.exclusive}
								options={Object.values(Platform)}
								optionsGroupLabel="Platforms"
								control={form.control}
							/>
							<MultiSelectField
								name="features"
								config={formFieldConfigs.features}
								options={Object.values(Feature)}
								optionsGroupLabel="Features"
								control={form.control}
							/>
							<ArrayInputField
								name="developer"
								config={formFieldConfigs.developer}
								control={form.control}
							/>
							<ArrayInputField
								name="publisher"
								config={formFieldConfigs.publisher}
								control={form.control}
							/>

							{/* Conference Field */}
							<FormField
								control={form.control}
								name="conferenceId"
								render={({ field }) => (
									<FormFieldWrapper>
										<FormLabel>{formFieldConfigs.conference.label}</FormLabel>
										<FormDescription className="mb-2">
											{formFieldConfigs.conference.description}
										</FormDescription>
										<Select
											onValueChange={(value) =>
												field.onChange(
													value === "none" ? undefined : Number(value),
												)
											}
											value={field.value ? field.value.toString() : "none"}
											disabled={conferencesLoading}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue
														placeholder={
															conferencesLoading
																? "Loading conferences..."
																: formFieldConfigs.conference.placeholder
														}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												{conferences?.map((conference) =>
													conference.id ? (
														<SelectItem
															key={conference.id}
															value={conference.id.toString()}
														>
															{conference.name}
														</SelectItem>
													) : null,
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormFieldWrapper>
								)}
							/>
						</div>
					</div>

					<Separator className="my-8" />

					{/* Media Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-xl tracking-tight">Media</h3>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ type: MediaType.Video, link: "" })}
								className="flex items-center gap-2"
							>
								<PlusCircle className="h-4 w-4" />
								Add Media
							</Button>
						</div>

						{fields.map((item, index) => (
							<MediaItem
								key={item.id}
								control={form.control}
								index={index}
								onRemove={() => remove(index)}
								canRemove={fields.length > 1}
							/>
						))}
						<FormField
							control={form.control}
							name="media"
							render={() => <FormMessage />}
						/>
					</div>
				</div>

				<div className="flex justify-end pt-6">
					<Button
						type="submit"
						disabled={createGameMutation.isPending}
						className="relative min-w-[120px]"
					>
						{createGameMutation.isPending ? (
							<>
								<span className="opacity-0">Save Game</span>
								<span className="absolute inset-0 flex items-center justify-center">
									Saving...
								</span>
							</>
						) : (
							"Save Game"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

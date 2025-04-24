"use client";

import { MediaType } from "@/@types/db";
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
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const mediaSchema = z.object({
  type: z.nativeEnum(MediaType),
  link: z.string().url({ message: "Please enter a valid URL" }),
});

const gameFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  releaseDate: z.string().optional(),
  genres: z.array(z.string()).optional(),
  exclusive: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  developer: z.array(z.string()).optional(),
  publisher: z.array(z.string()).optional(),
  hidden: z.boolean().optional(),
  conferenceId: z.number().optional(),
  media: z
    .array(mediaSchema)
    .min(1, { message: "At least one media item is required" }),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

interface GameFormProps {
  formIndex: number;
}

export default function GameForm({ formIndex }: GameFormProps) {
  const utils = api.useUtils();
  const conferences = api.conference.getAll.useQuery();

  const createGameMutation = api.combined.createGameWithMedia.useMutation({
    onSuccess: () => {
      toast.success("Game created successfully");
      form.reset();
      utils.game.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Error creating game: ${error.message}`);
    },
  });

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: "",
      releaseDate: "",
      genres: [],
      exclusive: [],
      features: [],
      developer: [],
      publisher: [],
      hidden: false,
      media: [
        {
          type: MediaType.Video,
          link: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "media",
  });

  function onSubmit(data: GameFormValues) {
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
  }

  // Convert comma-separated string inputs to arrays
  const handleArrayInput = (
    value: string,
    field: { onChange: (value: string[]) => void }
  ) => {
    if (!value) {
      field.onChange([]);
      return;
    }
    const array = value.split(",").map((item) => item.trim());
    field.onChange(array);
  };

  // Convert arrays back to comma-separated strings for display
  const arrayToString = (array: string[] | undefined) => {
    if (!array || array?.length === 0) return "";
    return array.join(", ");
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
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Game title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Release Date */}
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Release Date</FormLabel>
                    <FormControl>
                      <Input placeholder="Release date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Format: YYYY-MM-DD or text like "Q4 2023"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Game Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-xl tracking-tight">
              Game Details
            </h3>
            <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
              {/* Genres */}
              <FormField
                control={form.control}
                name="genres"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Genres</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Action, Adventure, RPG"
                        value={arrayToString(field.value)}
                        onChange={(e) =>
                          handleArrayInput(e.target.value, field)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of genres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exclusive Platforms */}
              <FormField
                control={form.control}
                name="exclusive"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Exclusive Platforms</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="PlayStation, Xbox, PC"
                        value={arrayToString(field.value)}
                        onChange={(e) =>
                          handleArrayInput(e.target.value, field)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of platforms
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Features */}
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Features</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Multiplayer, Singleplayer, DLC"
                        value={arrayToString(field.value)}
                        onChange={(e) =>
                          handleArrayInput(e.target.value, field)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of features
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Developer */}
              <FormField
                control={form.control}
                name="developer"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Developer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Developer names"
                        value={arrayToString(field.value)}
                        onChange={(e) =>
                          handleArrayInput(e.target.value, field)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of developers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Publisher */}
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Publisher</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Publisher names"
                        value={arrayToString(field.value)}
                        onChange={(e) =>
                          handleArrayInput(e.target.value, field)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of publishers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conference */}
              <FormField
                control={form.control}
                name="conferenceId"
                render={({ field }) => (
                  <FormItem className="flex min-h-20 flex-col justify-start">
                    <FormLabel className="mb-2">Conference</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a conference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        {conferences.data?.map(
                          (conference) =>
                            !!conference?.id?.toString()?.length && (
                              <SelectItem
                                key={conference.id}
                                value={conference.id.toString()}
                              >
                                {conference.name}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Associate with a conference (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
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

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4">
                <div className="grid flex-1 gap-x-6 gap-y-4 md:grid-cols-[auto_1fr]">
                  <FormField
                    control={form.control}
                    name={`media.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="flex min-h-20 flex-col justify-start">
                        <FormLabel className="mb-2">Media Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select media type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(MediaType).map(
                              (type) =>
                                !!type?.length && (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`media.${index}.link`}
                    render={({ field }) => (
                      <FormItem className="flex min-h-20 flex-col justify-start">
                        <FormLabel className="mb-2">Media URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/media"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={() => remove(index)}
                  disabled={fields?.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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

"use client";

import { Loader2Icon, Search, YoutubeIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { YouTubeChannel } from "@/@types/youtube";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";

export interface SearchChannelsProps {
	search?: string;
	id?: string;
}

export const SearchChannels = ({ search, id }: SearchChannelsProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const currentUrlSearchParams = useSearchParams();

	const [searchInput, setSearchInput] = useState(search || "");

	const {
		data: channelsData,
		isLoading,
		error: queryError,
		refetch,
	} = api.youtube.searchChannels.useQuery(
		{ query: searchInput },
		{
			enabled: !!searchInput && !id,
			staleTime: 60_000,
		},
	);

	useEffect(() => {
		setSearchInput(search || "");
	}, [search]);

	const updateUrlForSearch = useCallback(() => {
		const params = new URLSearchParams(currentUrlSearchParams.toString());
		if (searchInput.trim()) {
			params.set("channel_search", searchInput.trim());
		} else {
			params.delete("channel_search");
		}
		params.delete("channel_id");
		params.delete("page_token");
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	}, [searchInput, currentUrlSearchParams, pathname, router]);

	useEffect(() => {
		if (id) return;

		const handler = setTimeout(() => {
			updateUrlForSearch();
		}, 500);

		return () => clearTimeout(handler);
	}, [id, updateUrlForSearch]);

	const handleSearchFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchInput.trim() && !id) {
			refetch();
			updateUrlForSearch();
		}
	};

	const handleChannelSelect = (selectedChannelId: string) => {
		const params = new URLSearchParams();
		params.set("channel_id", selectedChannelId);
		if (search) {
			params.set("channel_search", search);
		}
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const channels =
		channelsData && !("error" in channelsData) ? channelsData : [];
	const apiError =
		channelsData && "error" in channelsData ? channelsData.error : null;
	const displayError = queryError || apiError;

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<Card className="border-2">
				<CardHeader className="space-y-2">
					<div className="flex items-center gap-2">
						<YoutubeIcon className="h-6 w-6 text-red-500" />
						<CardTitle>Search YouTube Channels</CardTitle>
					</div>
					<CardDescription>
						Search and select YouTube channels to view their content
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form onSubmit={handleSearchFormSubmit} className="flex gap-3">
						<Input
							type="text"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder="Enter channel name or keywords..."
							className="flex-1"
							disabled={!!id}
						/>
						<Button
							type="submit"
							disabled={!!id || isLoading}
							variant="default"
							size="default"
						>
							<Search className="mr-2 h-4 w-4" />
							Search
						</Button>
					</form>

					{isLoading && (
						<div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
							<Loader2Icon className="h-5 w-5 animate-spin" />
							<span>Searching YouTube channels...</span>
						</div>
					)}

					{displayError && (
						<div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm">
							<strong>Error:</strong> {displayError.message}
						</div>
					)}

					{!id && channels.length > 0 && (
						<ScrollArea className="h-[300px] rounded-lg border p-4">
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
								{channels.map((ch: YouTubeChannel) => (
									<Button
										key={ch.id}
										variant="outline"
										size="lg"
										onClick={() => handleChannelSelect(ch.id)}
										className="flex items-center gap-3 p-4 hover:bg-accent"
									>
										{ch.thumbnailUrl && (
											<Image
												src={ch.thumbnailUrl}
												alt={ch.title}
												className="h-10 w-10 rounded-full"
												width={48}
												height={48}
											/>
										)}
										<span className="flex-1 truncate text-left">
											{ch.title}
										</span>
									</Button>
								))}
							</div>
						</ScrollArea>
					)}

					{!id &&
						!isLoading &&
						!displayError &&
						channels.length === 0 &&
						searchInput.trim() !== "" && (
							<div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
								<Search className="h-8 w-8" />
								<p>No channels found for "{searchInput}"</p>
								<p className="text-sm">
									Try different keywords or check the spelling
								</p>
							</div>
						)}
				</CardContent>
			</Card>
		</div>
	);
};

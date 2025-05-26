"use client";

import { Loader2Icon, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { YouTubeChannel } from "@/@types/youtube";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
	}, [searchInput, id, updateUrlForSearch]);

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
		<div className="space-y-6 w-full max-w-xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>Search YouTube Channels</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSearchFormSubmit} className="flex gap-2">
						<Input
							type="text"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder="Search for YouTube channels..."
							className="flex-1"
							disabled={!!id}
						/>
						<Button type="submit" disabled={!!id || isLoading}>
							<Search className="mr-2 h-4 w-4" />
							Search
						</Button>
					</form>
					{isLoading && (
						<div className="flex items-center gap-2 mt-2">
							<Loader2Icon size="sm" className="animate-spin" />
							<span>Searching channels...</span>
						</div>
					)}
					{displayError && (
						<div className="text-red-500 mt-2 text-sm">
							Error: {displayError.message}
						</div>
					)}
					{!id && channels.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-2">
							{channels.map((ch: YouTubeChannel) => (
								<Button
									key={ch.id}
									variant="outline"
									size="sm"
									onClick={() => handleChannelSelect(ch.id)}
									className="flex items-center gap-2"
								>
									{ch.thumbnailUrl && (
										<img
											src={ch.thumbnailUrl}
											alt={ch.title}
											className="w-6 h-6 rounded-full"
										/>
									)}
									<span>{ch.title}</span>
								</Button>
							))}
						</div>
					)}
					{!id &&
						!isLoading &&
						!displayError &&
						channels.length === 0 &&
						searchInput.trim() !== "" && (
							<div className="mt-2 text-muted-foreground text-sm">
								No channels found for "{searchInput}".
							</div>
						)}
				</CardContent>
			</Card>
		</div>
	);
};

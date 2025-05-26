import { ChannelVideosGrid } from "@/features/youtube/components/channel-videos-grid";
import { SearchChannels } from "@/features/youtube/components/search-channels";

interface Props {
	searchParams: {
		search?: string;
		id?: string;
		max_results?: string;
		pageToken?: string;
	};
}

export default async function AddFromYoutubePage({ searchParams }: Props) {
	const { id: channelId, search, pageToken } = searchParams;
	const maxResultsParam = searchParams.max_results
		? parseInt(searchParams.max_results, 10)
		: 10;
	const maxResults = isNaN(maxResultsParam) ? 10 : maxResultsParam;

	return (
		<main className="container mx-auto flex min-h-screen flex-col items-center gap-8 p-4">
			<div className="w-full flex flex-col items-center">
				<SearchChannels search={search} id={channelId} />
			</div>

			<div className="w-full">
				{channelId ? (
					<ChannelVideosGrid
						channelId={channelId}
						initialPageToken={pageToken}
						maxResults={maxResults}
					/>
				) : (
					<div className="text-center text-muted-foreground opacity-60 mt-8">
						<span>Search and select a channel to view its videos.</span>
					</div>
				)}
			</div>
		</main>
	);
}

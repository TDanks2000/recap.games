import { ChannelVideosGrid } from "@/features/youtube/components/channel-videos-grid";
import { SearchChannels } from "@/features/youtube/components/search-channels";

interface Props {
	searchParams: Promise<{
		channel_search?: string;
		channel_id?: string;
		page_token?: string;
		max_results?: string;
	}>;
}

export default async function YoutubeTestPage({ searchParams }: Props) {
	const { channel_id, page_token, max_results, channel_search } =
		await searchParams;

	const maxResultsParam = max_results ? parseInt(max_results, 10) : 25;
	const maxResultsForVideos = isNaN(maxResultsParam) ? 25 : maxResultsParam;

	return (
		<main className="container mx-auto flex min-h-screen flex-col items-center gap-8 p-4">
			<div className="w-full flex flex-col items-center">
				<SearchChannels search={channel_search} id={channel_id} />
			</div>

			<div className="w-full">
				{channel_id ? (
					<ChannelVideosGrid
						channelId={channel_id}
						initialPageToken={page_token}
						maxResults={maxResultsForVideos}
					/>
				) : (
					<div className="text-center text-muted-foreground opacity-60 mt-8">
						<span>Search for a channel and select it to view its videos.</span>
					</div>
				)}
			</div>
		</main>
	);
}

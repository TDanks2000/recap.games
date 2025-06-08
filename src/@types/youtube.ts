export interface YouTubeVideo {
	id: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	publishedAt: string;
	videoUrl: string;
	type: "video" | "stream" | "playlist";
}

export interface YouTubeChannel {
	id: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	channelUrl: string;
}

export interface YouTubeChannelVideosPage {
	videos: YouTubeVideo[];
	nextPageToken?: string;
	prevPageToken?: string;
}

export interface YouTubeApiError {
	message: string;
	domain?: string;
	reason?: string;
}

export interface YouTubeErrorResponse {
	error: {
		code: number;
		message: string;
		errors: YouTubeApiError[];
	};
}

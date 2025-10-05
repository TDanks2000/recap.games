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

export interface YouTubeThumbnails {
	default?: {
		url: string;
		width?: number;
		height?: number;
	};
	medium?: {
		url: string;
		width?: number;
		height?: number;
	};
	high?: {
		url: string;
		width?: number;
		height?: number;
	};
	standard?: {
		url: string;
		width?: number;
		height?: number;
	};
	maxres?: {
		url: string;
		width?: number;
		height?: number;
	};
}

export interface YouTubeSearchResultItem {
	kind: string;
	etag: string;
	id: {
		kind: string;
		channelId?: string;
		videoId?: string;
		playlistId?: string;
	};
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: YouTubeThumbnails;
		channelTitle: string;
		liveBroadcastContent?: string;
	};
}

export interface YouTubeSearchResponse {
	kind: string;
	etag: string;
	nextPageToken?: string;
	prevPageToken?: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: YouTubeSearchResultItem[];
}

export interface YouTubeChannelItem {
	kind: string;
	etag: string;
	id: string;
	snippet: {
		title: string;
		description: string;
		customUrl?: string;
		publishedAt: string;
		thumbnails: YouTubeThumbnails;
		localized?: {
			title: string;
			description: string;
		};
		country?: string;
	};
	contentDetails?: {
		relatedPlaylists: {
			likes?: string;
			uploads?: string;
		};
	};
	statistics?: {
		viewCount: string;
		subscriberCount: string;
		hiddenSubscriberCount: boolean;
		videoCount: string;
	};
}

export interface YouTubeChannelResponse {
	kind: string;
	etag: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: YouTubeChannelItem[];
}

export interface YouTubePlaylistItemSnippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: YouTubeThumbnails;
	channelTitle: string;
	playlistId: string;
	position: number;
	resourceId: {
		kind: string;
		videoId: string;
	};
	videoOwnerChannelTitle?: string;
	videoOwnerChannelId?: string;
}

export interface YouTubePlaylistItem {
	kind: string;
	etag: string;
	id: string;
	snippet: YouTubePlaylistItemSnippet;
	contentDetails: {
		videoId: string;
		videoPublishedAt?: string;
	};
}

export interface YouTubePlaylistItemsResponse {
	kind: string;
	etag: string;
	nextPageToken?: string;
	prevPageToken?: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: YouTubePlaylistItem[];
}

export interface YouTubeVideoItem {
	kind: string;
	etag: string;
	id: string;
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: YouTubeThumbnails;
		channelTitle: string;
		tags?: string[];
		categoryId: string;
		liveBroadcastContent: string;
		localized?: {
			title: string;
			description: string;
		};
	};
	liveStreamingDetails?: {
		actualStartTime?: string;
		actualEndTime?: string;
		scheduledStartTime?: string;
		scheduledEndTime?: string;
		concurrentViewers?: string;
		activeLiveChatId?: string;
	};
}

export interface YouTubeVideosResponse {
	kind: string;
	etag: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: YouTubeVideoItem[];
}

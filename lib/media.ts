export interface MovieMedia {
	type: "movie";
	tmdbId: string;
}

export interface TvMedia {
	type: "tv";
	tmdbId: string;
	season: number;
	episode: number;
}

export type Media = MovieMedia | TvMedia;

export function parseMovieUrl(): MovieMedia | null {
	const path = window.location.pathname;
	const match = path.match(/^\/movie\/(\d+)/);
	if (!match) return null;
	return { type: "movie", tmdbId: match[1] };
}

export function parseTvUrl(): TvMedia | null {
	const path = window.location.pathname;
	const match = path.match(/^\/tv\/(\d+)[^/]*\/season\/(\d+)\/episode\/(\d+)/);
	if (!match) return null;
	return {
		type: "tv",
		tmdbId: match[1],
		season: Number(match[2]),
		episode: Number(match[3]),
	};
}

export function buildIframeSrc(media: Media): string {
	const base = "https://www.vidking.net/embed";
	if (media.type === "movie") {
		return `${base}/movie/${media.tmdbId}?autoPlay=true&color=5865f2`;
	}
	return `${base}/tv/${media.tmdbId}/${media.season}/${media.episode}?autoPlay=true&color=5865f2&nextEpisode=true&episodeSelector=true`;
}

const STORAGE_KEY = "kawakumo:progress";

interface ProgressEntry {
	currentTime: number;
	duration: number;
	updatedAt: number;
}

type ProgressStore = Record<string, ProgressEntry>;

function getStore(): ProgressStore {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function storageKey(
	mediaType: string,
	id: string,
	season?: number,
	episode?: number,
): string {
	if (mediaType === "tv" && season != null && episode != null) {
		return `${mediaType}:${id}:s${season}e${episode}`;
	}
	return `${mediaType}:${id}`;
}

export function saveProgress(
	mediaType: string,
	id: string,
	currentTime: number,
	duration: number,
	season?: number,
	episode?: number,
) {
	const store = getStore();
	const key = storageKey(mediaType, id, season, episode);
	store[key] = { currentTime, duration, updatedAt: Date.now() };
	localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getProgress(
	mediaType: string,
	id: string,
	season?: number,
	episode?: number,
): number {
	const store = getStore();
	const key = storageKey(mediaType, id, season, episode);
	return store[key]?.currentTime ?? 0;
}

import ReactDOM from "react-dom/client";
import type { ShadowRootContentScriptUi } from "wxt/utils/content-script-ui/shadow-root";
import { createShadowRootUi } from "wxt/utils/content-script-ui/shadow-root";
import { PlayerWidget } from "@/components/PlayerWidget";
import { parseTvUrl } from "@/lib/media";
import shadowStyles from "@/styles/shadow.css?inline";

function findEpisodeCard(pathname: string): Element | null {
	const cards = document.querySelectorAll<HTMLElement>(".card[data-url]");
	for (const card of cards) {
		if (card.dataset.url === pathname) {
			return card.querySelector(".title > .wrapper");
		}
	}
	return null;
}

function onUrlChange(callback: () => void, signal: AbortSignal) {
	let lastUrl = window.location.href;

	const interval = setInterval(() => {
		if (signal.aborted) {
			clearInterval(interval);
			return;
		}
		if (window.location.href !== lastUrl) {
			lastUrl = window.location.href;
			console.log("[kawakumo] URL poll detected change:", lastUrl);
			callback();
		}
	}, 500);
}

export default defineContentScript({
	matches: ["*://*.themoviedb.org/tv/*"],
	cssInjectionMode: "manual",
	async main(ctx) {
		console.log("[kawakumo] tv-content script started", window.location.href);

		let currentUi: ShadowRootContentScriptUi<ReactDOM.Root | undefined> | null =
			null;

		async function tryInject() {
			console.log("[kawakumo] tryInject called", window.location.pathname);

			if (currentUi) {
				currentUi.remove();
				currentUi = null;
			}

			const media = parseTvUrl();
			if (!media) {
				console.log("[kawakumo] no media parsed from URL");
				return;
			}
			console.log("[kawakumo] parsed media:", media);

			const anchor = findEpisodeCard(window.location.pathname);
			if (!anchor) {
				console.log(
					"[kawakumo] no matching card found for",
					window.location.pathname,
				);
				const allCards =
					document.querySelectorAll<HTMLElement>(".card[data-url]");
				console.log(
					"[kawakumo] available card data-urls:",
					[...allCards].map((c) => c.dataset.url),
				);
				return;
			}
			console.log("[kawakumo] found anchor element:", anchor);

			const ui = await createShadowRootUi(ctx, {
				name: "kawakumo-tv-player",
				position: "inline",
				anchor,
				append: "last",
				css: shadowStyles,
				onMount(uiContainer: HTMLElement) {
					const root = ReactDOM.createRoot(uiContainer);
					root.render(<PlayerWidget media={media} container={uiContainer} />);
					return root;
				},
				onRemove(root: ReactDOM.Root | undefined) {
					root?.unmount();
				},
			});
			ui.mount();
			currentUi = ui;
		}

		await tryInject();

		onUrlChange(() => {
			tryInject();
		}, ctx.signal);
	},
});

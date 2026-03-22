import ReactDOM from "react-dom/client";
import { createShadowRootUi } from "wxt/utils/content-script-ui/shadow-root";
import { PlayerWidget } from "@/components/PlayerWidget";
import { parseMovieUrl } from "@/lib/media";
import shadowStyles from "@/styles/shadow.css?inline";

export default defineContentScript({
	matches: ["*://*.themoviedb.org/movie/*"],
	cssInjectionMode: "ui",
	async main(ctx) {
		const media = parseMovieUrl();
		if (!media) return;

		const ui = await createShadowRootUi(ctx, {
			name: "kawakumo-player",
			position: "inline",
			anchor:
				"#original_header > div.header_poster_wrapper.true > section > div.flex.flex-col > ul",
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
	},
});

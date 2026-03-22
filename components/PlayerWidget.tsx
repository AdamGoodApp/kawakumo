import { Play } from "lucide-react";
import { useState } from "react";
import { PlayerModal } from "@/components/PlayerModal";
import { RainbowButton } from "@/components/ui/rainbow-button";
import type { Media } from "@/lib/media";

interface PlayerWidgetProps {
	media: Media;
	container: HTMLElement;
}

export function PlayerWidget({ media, container }: PlayerWidgetProps) {
	const [open, setOpen] = useState(false);

	const label = media.type === "movie" ? "Play Movie" : "Play Episode";

	return (
		<div
			style={{ display: "inline-flex", alignItems: "center", marginLeft: 20 }}
		>
			<RainbowButton onClick={() => setOpen(true)}>
				<Play className="size-4" />
				{label}
			</RainbowButton>
			<PlayerModal
				media={media}
				open={open}
				onOpenChange={setOpen}
				container={container}
			/>
		</div>
	);
}

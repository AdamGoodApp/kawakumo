import { VisuallyHidden } from "radix-ui";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { buildIframeSrc, type Media } from "@/lib/media";

interface PlayerModalProps {
	media: Media;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	container: HTMLElement;
}

export function PlayerModal({
	media,
	open,
	onOpenChange,
	container,
}: PlayerModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] p-0 overflow-hidden"
				portalContainer={container}
			>
				<VisuallyHidden.Root>
					<DialogTitle>Player</DialogTitle>
				</VisuallyHidden.Root>
				{open && (
					<iframe
						src={buildIframeSrc(media)}
						className="block w-full"
						height="600"
						frameBorder="0"
						allowFullScreen
						sandbox="allow-scripts allow-same-origin"
						title="Player"
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

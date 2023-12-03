import type { Viewport } from "next";

export default function generateViewport(): Viewport {
	return {
		themeColor: "#18CD85",
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
		colorScheme: "dark light"
	};
}

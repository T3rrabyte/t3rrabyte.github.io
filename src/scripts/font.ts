// eslint-disable-next-line camelcase
import { Noto_Serif, Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";

// eslint-disable-next-line new-cap
export const serif = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-serif"
});

// eslint-disable-next-line new-cap
export const sansSerif = Ubuntu_Sans({
	subsets: ["latin"],
	variable: "--font-sans-serif"
});

// eslint-disable-next-line new-cap
export const monospace = Ubuntu_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-monospace"
});

// eslint-disable-next-line camelcase
import { Noto_Serif, Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";

// eslint-disable-next-line new-cap
export const serif = Noto_Serif({
	fallback: ["Times New Roman", "Times", "serif"],
	subsets: ["latin"],
	variable: "--font-serif"
});

// TODO: Switch to Ubuntu Sans when Next.js 15 comes out.
// eslint-disable-next-line new-cap
export const sansSerif = Ubuntu_Sans({
	fallback: ["Arial", "Helvetica", "sans-serif"],
	subsets: ["latin"],
	variable: "--font-sans-serif"
});

// TODO: Switch to Ubuntu Sans Mono when Next.js 15 comes out.
// eslint-disable-next-line new-cap
export const monospace = Ubuntu_Sans_Mono({
	fallback: ["Courier New", "Courier", "monospace"],
	subsets: ["latin"],
	variable: "--font-monospace"
});

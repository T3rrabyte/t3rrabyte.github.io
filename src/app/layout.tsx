import "#global";
// eslint-disable-next-line camelcase
import { Noto_Serif, Ubuntu, Ubuntu_Mono } from "next/font/google";
import Gtag from "#Gtag";
import type { LayoutProps } from "#Props";
import Topnav from "#Topnav";
import domain from "#domain";
import style from "./layout.module.scss";

// eslint-disable-next-line new-cap
const fontSerif = Noto_Serif({
	fallback: ["Times New Roman", "Times", "serif"],
	subsets: ["latin"],
	variable: "--font-serif"
});

// TODO: Switch to Ubuntu Sans when Next.js 15 comes out.
// eslint-disable-next-line new-cap
const fontSansSerif = Ubuntu({
	fallback: ["Arial", "Helvetica", "sans-serif"],
	subsets: ["latin"],
	variable: "--font-sans-serif",
	weight: "400"
});

// TODO: Switch to Ubuntu Sans Mono when Next.js 15 comes out.
// eslint-disable-next-line new-cap
const fontMonospace = Ubuntu_Mono({
	fallback: ["Courier New", "Courier", "monospace"],
	subsets: ["latin"],
	variable: "--font-monospace",
	weight: "400"
});

export default function Layout({ children }: LayoutProps) {
	return (
		<html
			lang="en-US"
			className={`${fontSerif.variable} ${fontSansSerif.variable} ${fontMonospace.variable}`}
		>
			<body className={style["spacer"]}>
				<header>
					<Topnav />
				</header>
				<main>{children}</main>
				<footer></footer>
			</body>
			<Gtag id="G-HHPHD31E3M" />
		</html>
	);
}

export const viewport = {
	colorScheme: "dark light",
	themeColor: "#18CD85"
};

export const metadata = {
	authors: [{ name: "Travis Martin", url: domain }],
	creator: "Travis Martin",
	metadataBase: new URL(domain),
	openGraph: {
		siteName: "Lakuna",
		type: "website"
	},
	publisher: "Travis Martin",
	title: {
		default: "Page",
		template: "%s | Lakuna"
	},
	twitter: {
		creatorId: "1117270419298496513",
		siteId: "1117270419298496513"
	}
};

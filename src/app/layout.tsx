import "#global";
import { monospace, sansSerif, serif } from "#font";
import Gtag from "#Gtag";
import type { LayoutProps } from "#Props";
import Topnav from "#Topnav";
import domain from "#domain";
import style from "./layout.module.scss";

export default function Layout({ children }: LayoutProps) {
	return (
		<html
			lang="en-US"
			className={`${serif.variable} ${sansSerif.variable} ${monospace.variable}`}
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
	themeColor: "#50c878"
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

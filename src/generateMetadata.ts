import domain from "#domain";
import type { Metadata } from "next";

const twitterId = "1117270419298496513";
const authorName = "Travis Martin";

export default function generateMetadata(
	title: string,
	description: string,
	imageUrl: string,
	canonicalUrl: string
): Metadata {
	return {
		metadataBase: new URL(domain),
		title: title,
		description: description,
		generator: "Next.js",
		authors: {
			name: authorName,
			url: "https://www.lakuna.pw/"
		},
		colorScheme: "dark light",
		creator: authorName,
		publisher: authorName,
		openGraph: {
			title: title,
			description: description,
			url: canonicalUrl,
			siteName: "Lakuna",
			images: imageUrl,
			locale: "en-US",
			type: "website"
		},
		icons: "/favicon.ico",
		themeColor: "#18CD85",
		twitter: {
			card: "summary",
			title: title,
			description: description,
			siteId: twitterId,
			creatorId: twitterId,
			images: imageUrl
		}
	};
}

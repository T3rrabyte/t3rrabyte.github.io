import domain from "./domain";

export default function generateMetadata(title, description, imageUrl, canonicalUrl) {
	return {
		metadataBase: domain,
		title: title,
		description: description,
		generator: "Next.js",
		authors: {
			name: "Travis Martin",
			url: "https://www.lakuna.pw/"
		},
		colorScheme: "dark light",
		creator: "Travis Martin",
		publisher: "Travis Martin",
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
			siteId: "1117270419298496513",
			creatorId: "1117270419298496513",
			images: imageUrl
		}
	};
}

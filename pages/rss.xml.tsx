import { baseUrl } from "../assets/scripts/baseUrl";
import { articlesBuildPath, getBuildPaths, getWebPath, getFileName, getSlug, getFrontMatter } from "../assets/scripts/paths";

export default function Rss({ content }) {
	return <code>{content}</code>;
}

export async function getStaticProps() {
	// Begin RSS feed.
	let content = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
	content += "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">";
	content += "<channel>";

	// Add channel elements.
	content += "<title>Travis Martin's Blog</title>";
	content += "<link>https://www.lakuna.pw/</link>";
	content += "<description>A list of articles written by Travis Martin.</description>";
	content += "<language>en-us</language>";
	content += "<copyright>Copyright 2022, Travis Martin</copyright>";
	content += "<docs>https://validator.w3.org/feed/docs/rss2.html</docs>";
	content += "<atom:link href=\"https://www.lakuna.pw/rss.xml\" rel=\"self\" type=\"application/rss+xml\" />";

	// Add channel image.
	content += "<image>";
	content += "<url>https://www.lakuna.pw/images/favicon.png</url>";
	content += "<title>Travis Martin's Blog</title>";
	content += "<link>https://www.lakuna.pw/</link>";
	content += "</image>";

	// Get articles.
	const articleBuildPaths = (await getBuildPaths(`${articlesBuildPath}/*`))
		.filter((buildPath) => /\.mdx?$/.test(buildPath));
	const articles = await Promise.all(articleBuildPaths.map(async (buildPath) => {
		const webPath = getWebPath(buildPath);
		const fileName = getFileName(buildPath);
		const slug = getSlug(fileName);
		const frontMatter = await getFrontMatter(buildPath);

		return {
			webPath,
			fileName,
			slug,
			frontMatter
		};
	}));

	// Add articles.
	for (const article of articles) {
		// Begin item.
		content += "<item>";

		// Add item elements.
		content += `<title>${article.frontMatter.title ?? "Untitled Article"}</title>`;
		content += `<link>${baseUrl}/${article.webPath}</link>`;
		content += `<description>${article.frontMatter.description ?? "No description provided."}</description>`;
		content += "<author>tjmartin2003@gmail.com (Travis Martin)</author>";
		content += `<guid>${baseUrl}/${article.webPath}</guid>`;
		if (article.frontMatter.date) {
			content += `<pubDate>${new Date(article.frontMatter.date).toUTCString()}</pubDate>`;
		}

		// End item.
		content += "</item>";
	}

	// End RSS feed.
	content += "</channel>";
	content += "</rss>";

	return {
		props: {
			content
		}
	};
}

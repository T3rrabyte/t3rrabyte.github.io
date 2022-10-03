import { getBuildPaths, getFileName, getFrontMatter, getSlug, getWebPath, getWebPaths } from "./files.js";
import { articlesBuildPath, baseUrl, faviconImageWebPath, pagesBuildPath, rssBuildPath, rssWebPath, sitemapBuildPath } from "./constants.js";
import { writeFile } from "fs";
import { promisify } from "util";

const writeFilePromise = promisify(writeFile);

// Get list of articles.
const articleBuildPaths = (await getBuildPaths(`./${articlesBuildPath}/*`))
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

// Create XML string to describe the list of articles.
let articlesText = "";
for (const article of articles) {
	articlesText += `
		<item>
			<title>${article.frontMatter.title ?? "Untitled Article"}</title>
			<link>${baseUrl}/${article.webPath}</link>
			<description>${article.frontMatter.description ?? "No description provided."}</description>
			<author>tjmartin2003@gmail.com (Travis Martin)</author>
			<guid>${baseUrl}/${article.webPath}</guid>
			<pubDate>${new Date(article.frontMatter.date ?? 0).toUTCString()}</pubDate>
		</item>`;
}

// Create XML string for the RSS feed.
const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Travis Martin's Blog</title>
		<link>${baseUrl}</link>
		<description>A list of articles written by Travis Martin.</description>
		<language>en-us</language>
		<copyright>Copyright 2022, Travis Martin</copyright>
		<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
		<atom:link href="${baseUrl}/${rssWebPath}" rel="self" type="application/rss+xml" />
		<image>
			<url>${baseUrl}/${faviconImageWebPath}</url>
			<title>Travis Martin's Blog</title>
			<link>${baseUrl}</link>
		</image>${articlesText}
	</channel>
</rss>`;

// Write the RSS feed to a file.
await writeFilePromise(`./${rssBuildPath}`, rssContent);

// Get list of files.
const fileWebPaths = await getWebPaths(`./${pagesBuildPath}/**`);

// Create XML string to describe the list of files.
let pagesText = "";
for (const fileWebPath of fileWebPaths) {
	pagesText += `
	<url>
		<loc>${baseUrl}/${fileWebPath}</loc>
	</url>`;
}

// Create XML string for the sitemap.
const sitemapContent = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9/">${pagesText}
</urlset>`;

// Write the sitemap to a file.
await writeFilePromise(`./${sitemapBuildPath}`, sitemapContent);

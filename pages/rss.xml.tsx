import { join } from "path";
import { readdir, readFile } from "fs";
import { promisify } from "util";
import grayMatter from "gray-matter";

const readdirPromise = promisify(readdir);
const readFilePromise = promisify(readFile);

const pagesPath = join(process.cwd(), "pages");
const articlesPath = "articles";

export default function Rss() {
	// Do nothing.
}

export async function getServerSideProps({ res }) {
	// Begin RSS feed.
	let content = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
	content += "<rss version=\"2.0\">";
	content += "<channel>";

	// Add channel elements.
	content += "<title>Travis Martin's Blog</title>";
	content += "<link>https://www.lakuna.pw/</link>";
	content += "<description>A list of articles written by Travis Martin.</description>";
	content += "<language>en-us</language>";
	content += "<copyright>Copyright 2022, Travis Martin</copyright>";
	content += "<docs>https://validator.w3.org/feed/docs/rss2.html</docs>";
	content += "<image>https://www.lakuna.pw/images/favicon.png</image>";

	// Get articles.
	const fileNames = (await readdirPromise(join(pagesPath, articlesPath))).filter((fileName) => /\.mdx?$/.test(fileName));
	const articles = await Promise.all(fileNames.map(async (fileName) => {
		const slug = fileName.split(".")[0];
		const path = `${articlesPath}/${slug}`;
		const fileContent = await readFilePromise(join(pagesPath, articlesPath, fileName));
		const { data } = grayMatter(fileContent);

		return {
			slug,
			path,
			data
		};
	}));

	// Add articles.
	for (const article of articles) {
		// Begin item.
		content += "<item>";

		// Add item elements.
		content += `<title>${article.data.title ?? "Untitled Article"}</title>`;
		content += `<link>https://www.lakuna.pw/${article.path}</link>`;
		content += `<description>${article.data.description ?? "No description provided."}</description>`;
		content += "<author>Travis Martin</author>";
		content += `<guid>${article.slug}</guid>`;

		// End item.
		content += "</item>";
	}

	// End RSS feed.
	content += "</channel>";
	content += "</rss>";

	res.setHeader("Content-Type", "text/xml");
	res.write(content);
	res.end();

	return {
		props: {}
	};
}

import { join } from "path";
import { readdir, readFile } from "fs";
import { promisify } from "util";
import grayMatter from "gray-matter";
import Card from "../../assets/components/Card";
import CardList from "../../assets/components/CardList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const readdirPromise = promisify(readdir);
const readFilePromise = promisify(readFile);

const pagesPath = join(process.cwd(), "pages");
const articlesPath = "articles";

export default function Articles({ articles }) {
	return (
		<>
			<h1>Articles <Link href="/rss.xml"><a><FontAwesomeIcon icon={faRss} /></a></Link></h1>
			<CardList>
				{articles.map((article) =>
					<Card href={article.path} key={article.slug}>
						<h2>{article.data.title ?? "Untitled Article"}</h2>
						<p>{article.data.description ?? "No description."}</p>
					</Card>
				)}
			</CardList>
		</>
	);
}

export async function getStaticProps() {
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

	return {
		props: {
			title: "Articles",
			description: "A list of articles that I've written.",
			articles
		}
	};
}

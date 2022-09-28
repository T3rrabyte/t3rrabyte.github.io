import { readdir } from "fs";
import { promisify } from "util";
import { join } from "path";
import Card from "../../assets/components/Card";
import CardList from "../../assets/components/CardList";

const readDirectory = promisify(readdir);

const pagesBuildDirectory = join(process.cwd(), "pages");
const articlesWebDirectory = "articles";
const articlesBuildDirectory = join(pagesBuildDirectory, articlesWebDirectory);

export default function Articles({ slugs }: any) {
	return (
		<>
			<h1>Articles</h1>
			<CardList>
				{slugs.map((slug: string) =>
					<Card href={`${articlesWebDirectory}/${slug}`} key={slug}>
						<h2>{slug}</h2>
					</Card>
				)}
			</CardList>
		</>
	);
}

export async function getStaticProps() {
	const pages = await readDirectory(articlesBuildDirectory);

	const slugs = pages
		.filter((fileName) => fileName.match(/\.mdx?$/))
		.map((fileName) => fileName.split(".")[0]);

	return {
		props: {
			slugs
		}
	}
}

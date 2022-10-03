import grayMatter from "gray-matter";
import { unified } from "unified";
import nextMdx from "@next/mdx";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkPrism from "remark-prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeImgSize from "rehype-img-size";
import { join } from "path";

const suffixProcessor = unified()
	.use(remarkMdx)
	.use(remarkParse);

function remarkCustom() {
	return function transformer(tree, file) {
		// Extract front matter.
		const { data } = grayMatter(file.value);

		// Remove the front matter from the AST if it exists.
		if (Object.keys(data).length > 0) {
			// Front matter will appear as a thematic break and a header in an abstract syntax tree (AST).
			tree.children.shift();
			tree.children.shift();
		}

		// The string to be added to the end of the MDX.
		const suffix = `import Layout from "/assets/components/ArticleLayout";
		
export default function({ children }) {
	return <Layout>{children}</Layout>;
}

export function getStaticProps() {
	return {
		props: ${JSON.stringify(data)}
	};
}
`.replace(/(\t|\n)/g, "");

		// Turn the suffix into an AST.
		const suffixTree = suffixProcessor.parse(suffix);

		// Add the suffix's AST to the end of the original AST.
		for (const suffixChild of suffixTree.children) {
			tree.children.push(suffixChild);
		}
	}
}

const withMdx = nextMdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkCustom, remarkPrism, remarkMath],
		rehypePlugins: [rehypeKatex, [rehypeImgSize, { dir: join(process.cwd(), "public") }]],
		providerImportSource: "@mdx-js/react"
	}
});

export default withMdx({
	pageExtensions: ["tsx", "mdx"]
});

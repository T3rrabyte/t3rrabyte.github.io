import nextMdx from "@next/mdx";
import remarkPrism from "remark-prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeImgSize from "rehype-img-size";
import { join } from "path";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkPrism, remarkMath],
		rehypePlugins: [rehypeKatex, [rehypeImgSize, { dir: join(process.cwd(), "public") }]],
		providerImportSource: "@mdx-js/react"
	}
});

export default withMdx({
	pageExtensions: ["tsx", "mdx"]
});

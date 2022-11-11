import nextMdx from "@next/mdx";
import remarkPrism from "remark-prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkPrism, remarkMath],
		rehypePlugins: [rehypeKatex],
		providerImportSource: undefined // https://github.com/vercel/next.js/issues/42153
	}
});

export default withMdx({
	experimental: {
		appDir: true
	}
});

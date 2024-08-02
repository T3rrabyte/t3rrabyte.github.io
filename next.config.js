import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import createMDX from "@next/mdx";
import glsl from "highlight.js/lib/languages/glsl";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// TODO: Enable once the Rust-based MDX compiler supports extensions.
		mdxRs: false
	},
	pageExtensions: ["mdx", "ts", "tsx"],
	// eslint-disable-next-line @typescript-eslint/require-await
	async rewrites() {
		return {
			afterFiles: [],
			beforeFiles: [
				{
					destination: "http://mc.lakuna.pw:8154/:path*",
					has: [{ type: "host", value: "map.mc.lakuna.pw" }],
					source: "/:path*"
				}
			],
			fallback: []
		};
	}
};

const withMDX = createMDX({
	options: {
		rehypePlugins: [
			rehypeKatex,
			[rehypeHighlight, { languages: { bash, c, glsl, javascript, python } }]
		],
		remarkPlugins: [
			remarkFrontmatter,
			[remarkMdxFrontmatter, { name: "metadata" }],
			remarkMath
		]
	}
});

export default withMDX(nextConfig);

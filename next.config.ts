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
import type { NextConfig } from "next";

// TODO: Update to ESLint flat config once Next.js supports it.
// TODO: Remove `overrides` in `package.json` once everything fully supports React 19.

const nextConfig: NextConfig = {
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
	},
	sassOptions: {
		// TODO: Remove once vercel/next.js#71638 is fixed.
		silenceDeprecations: ["legacy-js-api"]
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

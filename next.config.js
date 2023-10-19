import nextMdx from "@next/mdx";
import remarkMath from "remark-math"; // Await update for `@mdx-js/loader` that depends on `unified@11.0.0` to update to `remark-math@6.0.0`.
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import glsl from "highlight.js/lib/languages/glsl";
import c from "highlight.js/lib/languages/c";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [
			rehypeKatex,
			[
				rehypeHighlight,
				{ detect: true, languages: { glsl, c, typescript, javascript } }
			]
		]
	}
});

export default withMdx({
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: "/:path*",
					has: [
						{
							type: "host",
							value: "map.mc.lakuna.pw"
						}
					],
					destination: "http://mc.lakuna.pw:8150/:path*"
				}
			]
		};
	},
	typescript: {
		ignoreBuildErrors: true // ¯\_(ツ)_/¯
	}
});

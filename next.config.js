import nextMdx from "@next/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import glsl from "highlight.js/lib/languages/glsl";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [
			rehypeKatex,
			[rehypeHighlight, { detect: true, languages: { glsl } }]
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

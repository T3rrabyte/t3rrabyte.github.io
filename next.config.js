import nextMdx from "@next/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import glsl from "highlight.js/lib/languages/glsl";
import c from "highlight.js/lib/languages/c";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [
			rehypeKatex,
			[
				rehypeHighlight,
				{
					detect: true,
					languages: { glsl, c, typescript, javascript, python, bash }
				}
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
					destination: "http://mc.lakuna.pw:8154/:path*"
				}
			]
		};
	},
	typescript: {
		ignoreBuildErrors: true // ¯\_(ツ)_/¯
	}
});

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

export default createMDX({
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
})({ pageExtensions: ["mdx", "ts", "tsx"] });

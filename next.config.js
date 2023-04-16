import nextMdx from "@next/mdx";
import remarkPrism from "remark-prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkPrism, remarkMath],
		rehypePlugins: [rehypeKatex]
	}
});

export default withMdx({
	experimental: {
		appDir: true
	},
	async rewrites() {
		return [
			{
				source: "/:path*",
				has: [
					{
						type: "header",
						key: "host",
						value: "map.mc.lakuna.pw"
					}
				],
				destination: "http://mc.lakuna.pw:8183/:path*"
			}
		];
	}
});

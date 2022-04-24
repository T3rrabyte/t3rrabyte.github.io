import mdx from "@next/mdx";
import prism from "remark-prism";
import math from "remark-math";
import katex from "rehype-katex";

const withMdx = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [prism, math],
    rehypePlugins: [katex]
  }
});

export default withMdx({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"]
});

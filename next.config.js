import mdx from "@next/mdx";
import prism from "remark-prism";
import math from "remark-math";
import mathjax from "rehype-mathjax";

const withMdx = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [prism, math],
    rehypePlugins: [mathjax]
  }
});

export default withMdx({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"]
});

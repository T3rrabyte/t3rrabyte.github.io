import mdx from "@next/mdx";
import prism from "remark-prism";

const withMdx = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [prism],
    rehypePlugins: []
  }
});

export default withMdx({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"]
});

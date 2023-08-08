import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import "#highlight";
import "#katex";

export default () => <Content />;

export const metadata = generateMetadata("Fast Inverse Square Root | Blog | Lakuna", "An in-depth review of the famous fast inverse square root algorithm as implemented in Quake III Arena.", "/favicon.png", "/a/q_rsqrt");

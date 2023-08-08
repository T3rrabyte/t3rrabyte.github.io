import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Text | WebGL | Lakuna", "An introduction to text in WebGL.", "/favicon.png", "/a/webgl/text");

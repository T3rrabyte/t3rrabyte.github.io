import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Attributes | WebGL | Lakuna", "An introduction to attributes in WebGL.", "/favicon.png", "/a/webgl/attributes");

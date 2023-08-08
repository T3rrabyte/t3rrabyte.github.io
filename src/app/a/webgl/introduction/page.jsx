import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Introduction | WebGL | Lakuna", "An introduction to WebGL.", "/favicon.png", "/a/webgl/introduction");

import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Transparency | WebGL | Lakuna", "An introduction to transparency in WebGL.", "/favicon.png", "/a/webgl/transparency");

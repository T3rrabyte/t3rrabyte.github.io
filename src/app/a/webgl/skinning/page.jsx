import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Skinning | WebGL | Lakuna", "An introduction to skinning in WebGL.", "/favicon.png", "/a/webgl/skinning");

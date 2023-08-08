import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Textures | WebGL | Lakuna", "An introduction to textures in WebGL.", "/favicon.png", "/a/webgl/textures");

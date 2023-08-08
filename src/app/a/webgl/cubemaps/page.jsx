import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Cubemaps | WebGL | Lakuna", "An introduction to cubemaps in WebGL.", "/favicon.png", "/a/webgl/cubemaps");

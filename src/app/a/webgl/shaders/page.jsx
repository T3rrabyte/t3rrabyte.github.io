import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Shaders | WebGL | Lakuna", "An introduction to shaders.", "/favicon.png", "/a/webgl/shaders");

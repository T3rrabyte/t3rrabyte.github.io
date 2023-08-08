import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Uniforms | WebGL | Lakuna", "An introduction to uniforms in WebGL.", "/favicon.png", "/a/webgl/uniforms");

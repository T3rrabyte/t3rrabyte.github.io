import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Varyings | WebGL | Lakuna", "An introduction to varyings in WebGL.", "/favicon.png", "/a/webgl/varyings");

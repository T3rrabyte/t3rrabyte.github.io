import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Shadows | WebGL | Lakuna", "An introduction to the techniques used to emulate shadows in WebGL.", "/favicon.png", "/a/webgl/shadows");

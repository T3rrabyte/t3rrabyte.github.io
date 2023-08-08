import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Lighting | WebGL | Lakuna", "An introduction to the techniques used to emulate lighting in WebGL.", "/favicon.png", "/a/webgl/lighting");

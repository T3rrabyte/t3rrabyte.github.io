import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Fog | WebGL | Lakuna", "An introduction to the techniques used to emulate fog in WebGL.", "/favicon.png", "/a/webgl/fog");

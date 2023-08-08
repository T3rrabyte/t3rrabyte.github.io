import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Transformation | WebGL | Lakuna", "An introduction to transformation in WebGL.", "/favicon.png", "/a/webgl/transformation");

import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Picking | WebGL | Lakuna", "An introduction to picking in WebGL.", "/favicon.png", "/a/webgl/picking");

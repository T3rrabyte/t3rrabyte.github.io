import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("3D | WebGL | Lakuna", "An introduction to depth and the techniques used to render three-dimensional scenes in WebGL.", "/favicon.png", "/a/webgl/3d");

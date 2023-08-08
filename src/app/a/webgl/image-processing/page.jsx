import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Image Processing | WebGL | Lakuna", "An introduction to image processing in WebGL.", "/favicon.png", "/a/webgl/image-processing");

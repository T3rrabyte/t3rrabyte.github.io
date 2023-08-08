import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("GPGPU | WebGL | Lakuna", "An introduction to general-purpose GPU in WebGL.", "/favicon.png", "/a/webgl/gpgpu");

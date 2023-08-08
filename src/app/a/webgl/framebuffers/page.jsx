import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Framebuffers | WebGL | Lakuna", "An introduction to framebuffers in WebGL.", "/favicon.png", "/a/webgl/framebuffers");

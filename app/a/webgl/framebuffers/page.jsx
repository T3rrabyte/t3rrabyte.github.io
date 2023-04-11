import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Framebuffers", "An introduction to framebuffers in WebGL.", "/favicon.png", "/a/webgl/framebuffers");

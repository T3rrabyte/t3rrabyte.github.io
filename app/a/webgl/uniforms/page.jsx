import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Uniforms", "An introduction to uniforms in WebGL.", "/favicon.png", "/a/webgl/uniforms");

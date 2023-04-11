import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL GPGPU", "An introduction to general-purpose GPU in WebGL.", "/favicon.png", "/a/webgl/gpgpu");

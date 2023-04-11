import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Image Processing", "An introduction to image processing in WebGL.", "/favicon.png", "/a/webgl/image-processing");

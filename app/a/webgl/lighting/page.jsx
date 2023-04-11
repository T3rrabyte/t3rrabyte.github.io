import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Lighting", "An introduction to the techniques used to emulate lighting in WebGL.", "/favicon.png", "/a/webgl/lighting");

import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL 3D", "An introduction to depth and the techniques used to render three-dimensional scenes in WebGL.", "/favicon.png", "/a/webgl/3d");

import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Scene Graph", "An introduction to the scene graph data structure as it relates to WebGL.", "/favicon.png", "/a/webgl/scene-graph");

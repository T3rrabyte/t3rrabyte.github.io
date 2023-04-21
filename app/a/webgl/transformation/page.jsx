import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Transformation", "An introduction to transformation in WebGL.", "/favicon.png", "/a/webgl/transformation");

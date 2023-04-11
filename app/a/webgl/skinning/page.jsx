import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Skinning", "An introduction to skinning in WebGL.", "/favicon.png", "/a/webgl/skinning");

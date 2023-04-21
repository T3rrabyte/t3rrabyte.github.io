import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Textures", "An introduction to textures in WebGL.", "/favicon.png", "/a/webgl/textures");

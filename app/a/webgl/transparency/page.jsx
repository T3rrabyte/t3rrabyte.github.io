import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Transparency", "An introduction to transparency in WebGL.", "/favicon.png", "/a/webgl/transparency");

import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Shadows", "An introduction to the techniques used to emulate shadows in WebGL.", "/favicon.png", "/a/webgl/shadows");

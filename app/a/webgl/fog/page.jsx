import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Fog", "An introduction to the techniques used to emulate fog in WebGL.", "/favicon.png", "/a/webgl/fog");

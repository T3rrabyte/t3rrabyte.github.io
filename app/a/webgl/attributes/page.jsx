import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Attributes", "An introduction to attributes in WebGL.", "/favicon.png", "/a/webgl/attributes");

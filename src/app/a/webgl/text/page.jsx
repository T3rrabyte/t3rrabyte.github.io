import Content from "./content.mdx";
import generateMetadata from "site/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Text", "An introduction to text in WebGL.", "/favicon.png", "/a/webgl/text");

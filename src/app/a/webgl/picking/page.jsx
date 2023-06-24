import Content from "./content.mdx";
import generateMetadata from "site/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Picking", "An introduction to picking in WebGL.", "/favicon.png", "/a/webgl/picking");

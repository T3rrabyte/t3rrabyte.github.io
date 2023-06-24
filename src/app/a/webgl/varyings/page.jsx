import Content from "./content.mdx";
import generateMetadata from "site/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Varyings", "An introduction to varyings in WebGL.", "/favicon.png", "/a/webgl/varyings");

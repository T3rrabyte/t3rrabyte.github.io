import Content from "./content.mdx";
import generateMetadata from "site/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Cubemaps", "An introduction to cubemaps in WebGL.", "/favicon.png", "/a/webgl/cubemaps");

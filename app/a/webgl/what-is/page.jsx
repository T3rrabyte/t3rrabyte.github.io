import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("What is WebGL?", "An overview of WebGL.", "/favicon.png", "/a/webgl/what-is");

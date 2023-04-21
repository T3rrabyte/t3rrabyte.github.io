import Content from "./content.mdx";
import generateMetadata from "../../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL \"Hello, world!\"", "An minimal example WebGL program.", "/favicon.png", "/a/webgl/hello-world");

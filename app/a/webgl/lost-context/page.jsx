import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Lost Context", "An introduction to handling lost context in WebGL.", "/favicon.png", "/a/webgl/lost-context");

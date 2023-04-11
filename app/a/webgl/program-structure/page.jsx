import Content from "./content.mdx";
import generateMetadata from "../../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("WebGL Program Structure", "A reference page for the typical structure of a WebGL API program.", "/favicon.png", "/a/webgl/program-structure");

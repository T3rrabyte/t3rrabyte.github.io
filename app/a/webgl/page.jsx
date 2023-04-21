import Content from "./content.mdx";
import generateMetadata from "../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("Introduction to WebGL2", "The table of contents for my WebGL2 tutorial series.", "/favicon.png", "/a/webgl");

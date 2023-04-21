import Content from "./content.mdx";
import generateMetadata from "../../../shared/generateMetadata";
import "prism-themes/themes/prism-atom-dark.min.css";
import "katex/dist/katex.min.css";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("Fast Inverse Square Root", "An in-depth review of the famous fast inverse square root algorithm as implemented in Quake III Arena.", "/favicon.png", "/a/q_rsqrt");

import Content from "./content.mdx";
import generateMetadata from "site/generateMetadata";
import "prism-themes/themes/prism-atom-dark.min.css";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("Esoteric JavaScript", "JavaScript with just six unique characters.", "/favicon.png", "/a/esojs");

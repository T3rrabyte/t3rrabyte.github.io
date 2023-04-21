import Content from "./content.mdx";
import generateMetadata from "../../../shared/generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("MTG Deck Building Compendium", "A summary of my knowledge about deck building for Magic: The Gathering.", "/favicon.png", "/a/mtg");

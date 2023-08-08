import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("MTG Deck Building Compendium | Blog | Lakuna", "A summary of my knowledge about deck building for Magic: The Gathering.", "/favicon.png", "/a/mtg");

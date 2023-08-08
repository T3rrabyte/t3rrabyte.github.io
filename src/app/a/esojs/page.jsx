import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import "#highlight";

export default () => <Content />;

export const metadata = generateMetadata("Esoteric JavaScript | Blog | Lakuna", "JavaScript with just six unique characters.", "/favicon.png", "/a/esojs");

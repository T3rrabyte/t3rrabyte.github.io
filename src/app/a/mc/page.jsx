import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Minecraft Server | Blog | Lakuna", "Travis Martin's public Minecraft server.", "/favicon.png", "/a/mc");

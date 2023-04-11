import Content from "./content.mdx";
import generateMetadata from "../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("Minecraft Server", "Travis Martin's public Minecraft server.", "/favicon.png", "/a/mc");

import Content from "./content.mdx";
import generateMetadata from "../../generateMetadata";

export default function Page() {
	return <Content />;
}

export const metadata = generateMetadata("Story Rating System", "Travis Martin's rating system for stories.", "/favicon.png", "/a/srs");

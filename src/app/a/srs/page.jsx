import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Story Rating System | Blog | Lakuna", "Travis Martin's rating system for stories.", "/favicon.png", "/a/srs");

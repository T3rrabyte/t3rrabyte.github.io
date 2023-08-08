import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Index | WebGL | Lakuna", "The table of contents for my WebGL2 tutorial series.", "/favicon.png", "/a/webgl");

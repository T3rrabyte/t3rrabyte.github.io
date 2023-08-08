import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Glossary | WebGL | Lakuna", "A list of terms used in this tutorial series.", "/favicon.png", "/a/webgl/glossary");

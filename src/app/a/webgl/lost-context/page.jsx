import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("Handling Lost Context | WebGL | Lakuna", "An introduction to handling lost context in WebGL.", "/favicon.png", "/a/webgl/lost-context");

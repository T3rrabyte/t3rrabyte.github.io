import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";

export default () => <Content />;

export const metadata = generateMetadata("The Scene Graph | WebGL | Lakuna", "An introduction to the scene graph data structure as it relates to WebGL.", "/favicon.png", "/a/webgl/scene-graph");

import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"The Scene Graph | WebGL | Lakuna",
	"An introduction to the scene graph data structure as it relates to WebGL.",
	"/favicon.png",
	"/a/webgl/scene-graph"
);

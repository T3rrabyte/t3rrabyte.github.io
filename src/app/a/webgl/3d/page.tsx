import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"3D | WebGL | Lakuna",
	"An introduction to depth and the techniques used to render three-dimensional scenes in WebGL.",
	"/favicon.png",
	"/a/webgl/3d"
);

import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Textures | WebGL | Lakuna",
	"An introduction to textures in WebGL.",
	"/favicon.png",
	"/a/webgl/textures"
);

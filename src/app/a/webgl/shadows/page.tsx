import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Shadows | WebGL | Lakuna",
	"An introduction to the techniques used to emulate shadows in WebGL.",
	"/favicon.png",
	"/a/webgl/shadows"
);

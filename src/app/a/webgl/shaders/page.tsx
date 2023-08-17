import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Shaders | WebGL | Lakuna",
	"An introduction to shaders.",
	"/favicon.png",
	"/a/webgl/shaders"
);

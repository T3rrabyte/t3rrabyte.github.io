import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Framebuffers | WebGL | Lakuna",
	"An introduction to framebuffers in WebGL.",
	"/favicon.png",
	"/a/webgl/framebuffers"
);

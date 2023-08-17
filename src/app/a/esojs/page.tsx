import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import "#highlight";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Esoteric JavaScript | Blog | Lakuna",
	"JavaScript with just six unique characters.",
	"/favicon.png",
	"/a/esojs"
);

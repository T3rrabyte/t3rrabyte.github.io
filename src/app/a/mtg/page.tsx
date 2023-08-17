import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"MTG Deck Building Compendium | Blog | Lakuna",
	"A summary of my knowledge about deck building for Magic: The Gathering.",
	"/favicon.png",
	"/a/mtg"
);

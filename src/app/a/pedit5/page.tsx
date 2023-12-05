import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"The Dungeon | Blog | Lakuna",
	"A review of my world record speedrun of the first CRPG.",
	"/favicon.png",
	"/a/pedit5"
);

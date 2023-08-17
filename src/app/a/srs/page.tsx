import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Story Rating System | Blog | Lakuna",
	"Travis Martin's rating system for stories.",
	"/favicon.png",
	"/a/srs"
);

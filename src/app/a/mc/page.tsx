import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Minecraft Server | Blog | Lakuna",
	"Travis Martin's public Minecraft server.",
	"/favicon.png",
	"/a/mc"
);

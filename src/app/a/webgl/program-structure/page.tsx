import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Program Structure | WebGL | Lakuna",
	"A reference page for the typical structure of a program that uses the WebGL API.",
	"/favicon.png",
	"/a/webgl/program-structure"
);

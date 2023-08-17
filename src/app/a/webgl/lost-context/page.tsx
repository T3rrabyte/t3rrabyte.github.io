import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Handling Lost Context | WebGL | Lakuna",
	"An introduction to handling lost context in WebGL.",
	"/favicon.png",
	"/a/webgl/lost-context"
);

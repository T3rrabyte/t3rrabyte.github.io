import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Glossary | WebGL | Lakuna",
	"A list of terms used in this tutorial series.",
	"/favicon.png",
	"/a/webgl/glossary"
);

import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import "#highlight";
import "#katex";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Crash Course: Computer Vision | Blog | Lakuna",
	"The companion article for my presentation on computer vision and Lunabotics.",
	"/favicon.png",
	"/a/cccv"
);

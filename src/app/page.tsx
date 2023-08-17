import OneLiner from "./OneLiner.tsx";
import Socials from "./Socials/index.tsx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return (
		<>
			<h1 style={{ textAlign: "center" }}>Travis Martin</h1>
			<OneLiner style={{ textAlign: "center" }} />
			<hr />
			<Socials style={{ textAlign: "center" }} />
		</>
	);
}

export const metadata: Metadata = generateMetadata(
	"Lakuna",
	"Travis Martin's website.",
	"/favicon.png",
	"/"
);

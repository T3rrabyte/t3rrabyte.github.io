import { BsRss } from "react-icons/bs";
import CardList from "#CardList";
import Card from "#Card";
import Image from "next/image";
import minecraftServerPreview from "#app/a/mc/preview.png";
import SpecularLighting from "#app/a/webgl/lighting/SpecularLighting.tsx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return (
		<>
			<h1>
				Blog{" "}
				<a href="/rss.xml">
					<BsRss />
				</a>
			</h1>
			<CardList>
				<Card href="/a/pedit5">
					<h2>The Dungeon</h2>
					<p>An in-depth look at the first computer role-playing game, including a review of my world record speedrun.</p>
				</Card>
				<Card href="/a/q_rsqrt">
					<h2>Fast Inverse Square Root</h2>
					<p>An explanation of the famous fast inverse square root algorithm as it is implemented in Quake III Arena.</p>
				</Card>
				<Card href="/a/esojs">
					<h2>Esoteric JavaScript</h2>
					<p>A guide on how to write any JavaScript program with just six unique characters.</p>
				</Card>
				<Card href="/a/webgl">
					<h2>WebGL2 Tutorial</h2>
					<p>The index of my WebGL2 tutorial.</p>
					<SpecularLighting style={{ width: "100%" }} />
				</Card>
			</CardList>
		</>
	);
}

export const metadata: Metadata = generateMetadata(
	"Blog | Lakuna",
	"Travis Martin's blog.",
	"/favicon.png",
	"/blog"
);

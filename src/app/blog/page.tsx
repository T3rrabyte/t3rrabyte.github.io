import { BsRss } from "react-icons/bs";
import CardList from "#CardList";
import Card from "#Card";
import Image from "next/image";
import minecraftServerPreview from "#app/a/mc/preview.png";
import SceneGraph from "#app/a/webgl/scene-graph/SceneGraph.tsx";
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
				<Card href="/a/q_rsqrt">
					<h2>Fast Inverse Square Root</h2>
					<p>
						An in-depth review of the famous fast inverse square root algorithm
						as implemented in Quake III Arena.
					</p>
				</Card>
				<Card href="/a/esojs">
					<h2>Esoteric JavaScript</h2>
					<p>
						How to write any JavaScript program with just six unique characters.
					</p>
				</Card>
				<Card href="/a/webgl">
					<h2>WebGL2 Tutorial</h2>
					<p>The index of my WebGL2 tutorial.</p>
					<SceneGraph style={{ width: "100%" }} />
				</Card>
				<Card href="/a/mc">
					<h2>Minecraft Server</h2>
					<p>My public Minecraft server.</p>
					<Image
						src={minecraftServerPreview}
						alt="Minecraft server preview."
						style={{ width: "100%", height: "auto" }}
						placeholder="blur"
					/>
				</Card>
				<Card href="/a/mtg">
					<h2>MTG Deck Building Compendium</h2>
					<p>
						A summary of my knowledge about deck building for Magic: The
						Gathering.
					</p>
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

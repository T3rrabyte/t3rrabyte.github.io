import { BsRss } from "react-icons/bs";
import CardList from "#CardList";
import Card from "#Card";
import SpecularLighting from "#app/a/webgl/lighting/SpecularLighting.tsx";
import generateMetadata from "#generateMetadata";
import type { Metadata } from "next";
import type { JSX } from "react";
import contourDetection from "#app/a/cccv/contour-detection.png";
import minecraftPreview from "#app/a/mc/preview.png";
import Image from "next/image";

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
				<Card href="/a/cccv">
					<h2>Crash Course: Computer Vision</h2>
					<p>
						The companion article for my presentation on computer vision and
						Lunabotics.
					</p>
					<Image
						src={contourDetection}
						alt="Contour detection example."
						style={{ width: "100%", height: "auto" }}
						placeholder="blur"
					/>
				</Card>
				<Card href="/a/pedit5">
					<h2>The Dungeon</h2>
					<p>
						An in-depth look at the first computer role-playing game, including
						a review of my world record speedrun.
					</p>
				</Card>
				<Card href="/a/q_rsqrt">
					<h2>Fast Inverse Square Root</h2>
					<p>
						An explanation of the famous fast inverse square root algorithm as
						it is implemented in Quake III Arena.
					</p>
				</Card>
				<Card href="/a/esojs">
					<h2>Esoteric JavaScript</h2>
					<p>
						A guide on how to write any JavaScript program with just six unique
						characters.
					</p>
				</Card>
				<Card href="/a/webgl">
					<h2>WebGL2 Tutorial</h2>
					<p>The index of my WebGL2 tutorial.</p>
					<SpecularLighting style={{ width: "100%" }} />
				</Card>
				<Card href="/a/mc">
					<h2>Minecraft Server</h2>
					<p>
						My public Minecraft server, which can be used to test all of my
						mods.
					</p>
					<Image
						src={minecraftPreview}
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

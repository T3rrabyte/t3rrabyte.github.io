import { BsRss } from "react-icons/bs";
import CardList from "../CardList";
import Card from "../Card";
import Image from "next/image";
import minecraftServerPreview from "../a/mc/preview.png";
import SpecularLighting from "../a/webgl/lighting/SpecularLighting";
import Link from "next/link";
import generateMetadata from "../generateMetadata";

export default function Page() {
	return (
		<>
			<h1>Blog <Link href="/rss.xml"><BsRss /></Link></h1>
			<CardList>
				<Card href="/a/webgl">
					<h2>WebGL2 Tutorial</h2>
					<p>The index of my WebGL2 tutorial.</p>
					<SpecularLighting style={{ width: "100%" }} />
				</Card>
				<Card href="/a/mc">
					<h2>Minecraft Server</h2>
					<p>My public Minecraft server.</p>
					<Image src={minecraftServerPreview} alt="Minecraft server preview." style={{ width: "100%", height: "auto" }} placeholder="blur" />
				</Card>
				<Card href="/a/mtg">
					<h2>MTG Deck Building Compendium</h2>
					<p>A summary of my knowledge about deck building for Magic: The Gathering.</p>
				</Card>
			</CardList>
		</>
	);
}

export const metadata = generateMetadata("Blog", "Travis Martin's blog.", "/favicon.png", "/blog");

import { BsRss } from "react-icons/bs";
import CardList from "../CardList";
import Card from "../Card";
import Image from "next/image";
import minecraftServerPreview from "../a/mc/preview.png";
import SpecularLighting from "../a/webgl/lighting/SpecularLighting";

export default function Page() {
	return (
		<>
			<h1>Blog <a href="/rss.xml"><BsRss /></a></h1>
			<CardList>
				<Card href="/a/webgl">
					<h2>WebGL2 Tutorial</h2>
					<p>The index of my WebGL2 tutorial.</p>
					<SpecularLighting style={{ width: "100%" }} />
				</Card>
				<Card href="/a/srs">
					<h2>Story Rating System</h2>
					<p>The rating system I use for stories and literature.</p>
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

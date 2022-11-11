import Link from "next/link";
import { BsRss } from "react-icons/bs";
import CardList from "../CardList";
import Card from "../Card";

export default function Page() {
	return (
		<>
			<h1>Blog <Link href="/rss.xml"><BsRss /></Link></h1>
			<CardList>
				<Card href="/a/webgl">
					<h2>WebGL2 Tutorial</h2>
					<p>The index of my WebGL2 tutorial.</p>
				</Card>
				<Card href="/a/srs">
					<h2>Story Rating System</h2>
					<p>The rating system I use for stories and literature.</p>
				</Card>
				<Card href="/a/mc">
					<h2>Minecraft Server</h2>
					<p>My public Minecraft server.</p>
				</Card>
				<Card href="/a/mtg">
					<h2>MTG Deck Building Compendium</h2>
					<p>A summary of my knowledge about deck building for Magic: The Gathering.</p>
				</Card>
			</CardList>
		</>
	);
}

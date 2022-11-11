import Title from "../../Title";
import Description from "../../Description";
import ImageUrl from "../../ImageUrl";
import CanonicalUrl from "../../CanonicalUrl";

export default function Head() {
	return (
		<>
			<Title>MTG Deck Building Compendium</Title>
			<Description>A summary of my knowledge about deck building for Magic: The Gathering.</Description>
			<ImageUrl>/favicon.png</ImageUrl>
			<CanonicalUrl>/a/mtg</CanonicalUrl>
		</>
	);
}

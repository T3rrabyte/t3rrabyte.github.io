import Title from "../Title";
import Description from "../Description";
import ImageUrl from "../ImageUrl";
import CanonicalUrl from "../CanonicalUrl";

export default function Head() {
	return (
		<>
			<Title>Portfolio</Title>
			<Description>Travis Martin's software development portfolio.</Description>
			<ImageUrl>/favicon.png</ImageUrl>
			<CanonicalUrl>/portfolio</CanonicalUrl>
		</>
	);
}

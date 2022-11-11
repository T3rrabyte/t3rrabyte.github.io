import Title from "./Title";
import Description from "./Description";
import ImageUrl from "./ImageUrl";
import CanonicalUrl from "./CanonicalUrl";

export default function Head() {
	return (
		<>
			<Title>Travis Martin</Title>
			<Description>Travis Martin's website.</Description>
			<ImageUrl>/favicon.png</ImageUrl>
			<CanonicalUrl>/</CanonicalUrl>
		</>
	);
}

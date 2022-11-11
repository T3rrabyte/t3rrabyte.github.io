import Title from "../Title";
import Description from "../Description";
import ImageUrl from "../ImageUrl";
import CanonicalUrl from "../CanonicalUrl";

export default function Head() {
	return (
		<>
			<Title>Blog</Title>
			<Description>Travis Martin's blog.</Description>
			<ImageUrl>/favicon.png</ImageUrl>
			<CanonicalUrl>/blog</CanonicalUrl>
		</>
	);
}

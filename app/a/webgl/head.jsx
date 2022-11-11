import Title from "../../Title";
import Description from "../../Description";
import ImageUrl from "../../ImageUrl";
import CanonicalUrl from "../../CanonicalUrl";

export default function Head() {
	return (
		<>
			<Title>Introduction to WebGL2</Title>
			<Description>The table of contents for my WebGL2 tutorial series.</Description>
			<ImageUrl>/favicon.png</ImageUrl>
			<CanonicalUrl>/a/webgl</CanonicalUrl>
		</>
	);
}

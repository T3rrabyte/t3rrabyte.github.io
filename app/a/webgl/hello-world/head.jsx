import Title from "../../../Title";
import Description from "../../../Description";
import ImageUrl from "../../../ImageUrl";
import CanonicalUrl from "../../../CanonicalUrl";

export default function Head() {
	return (
		<>
			<Title>WebGL "Hello, world!"</Title>
			<Description>A minimal example WebGL program.</Description>
			<ImageUrl>/favicon.png</ImageUrl>
			<CanonicalUrl>/a/webgl/hello-world</CanonicalUrl>
		</>
	);
}

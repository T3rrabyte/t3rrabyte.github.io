import Title from "../../Title";
import Description from "../../Description";
import ImageUrl from "../../ImageUrl";
import CanonicalUrl from "../../CanonicalUrl";

export default function Head() {
	return (
		<>
			<Title>Minecraft Server</Title>
			<Description>Travis Martin's public Minecraft server.</Description>
			<ImageUrl>/favicon.png</ImageUrl>
			<CanonicalUrl>/a/mc</CanonicalUrl>
		</>
	);
}

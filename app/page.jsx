import ButtonLink from "./ButtonLink";
import { BsGithub, BsReddit, BsLinkedin, BsTwitch, BsTwitter, BsFacebook, BsYoutube } from "react-icons/bs";
import OneLiner from "./OneLiner";

export default function Page() {
	return (
		<>
			<h1 style={{ textAlign: "center" }}>Travis Martin</h1>
			<OneLiner style={{ textAlign: "center" }} />
			<hr />
			<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
				<ButtonLink href="https://github.com/Lakuna"><BsGithub /></ButtonLink>
				<ButtonLink href="https://www.reddit.com/user/T3Lacuna"><BsReddit /></ButtonLink>
				<ButtonLink href="https://www.linkedin.com/in/t-j-m/"><BsLinkedin /></ButtonLink>
				<ButtonLink href="https://www.twitch.tv/lakuna0"><BsTwitch /></ButtonLink>
				<ButtonLink href="https://twitter.com/T3Lakuna"><BsTwitter /></ButtonLink>
				<ButtonLink href="https://www.facebook.com/profile.php?id=100027929321707"><BsFacebook /></ButtonLink>
				<ButtonLink href="https://www.youtube.com/channel/UC0AjiYU8DPKcBKUfIQoUGNg"><BsYoutube /></ButtonLink>
			</div>
		</>
	);
}

import ButtonLink from "../assets/components/ButtonLink";
import OneLiner from "../assets/components/OneLiner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faReddit, faFacebook, faYoutube, faLinkedin, faTwitch, faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Index() {
	return (
		<div style={{ textAlign: "center" }}>
			<h1>Travis Martin</h1>
			<p><OneLiner /></p>
			<hr />
			<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
				<ButtonLink href="https://github.com/Lakuna"><FontAwesomeIcon icon={faGithub} /></ButtonLink>
				<ButtonLink href="https://www.reddit.com/user/T3Lacuna"><FontAwesomeIcon icon={faReddit} /></ButtonLink>
				<ButtonLink href="https://www.linkedin.com/in/t-j-m/"><FontAwesomeIcon icon={faLinkedin} /></ButtonLink>
				<ButtonLink href="https://www.twitch.tv/lakuna0"><FontAwesomeIcon icon={faTwitch} /></ButtonLink>
				<ButtonLink href="https://twitter.com/T3Lakuna"><FontAwesomeIcon icon={faTwitter} /></ButtonLink>
				<ButtonLink href="https://www.facebook.com/profile.php?id=100027929321707"><FontAwesomeIcon icon={faFacebook} /></ButtonLink>
				<ButtonLink href="https://www.youtube.com/channel/UC0AjiYU8DPKcBKUfIQoUGNg"><FontAwesomeIcon icon={faYoutube} /></ButtonLink>
			</div>
		</div>
	);
}

export function getStaticProps() {
	return {
		props: {
			title: "Travis Martin",
			description: "Travis Martin's website."
		}
	};
}

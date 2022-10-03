import ButtonLink from "../assets/components/ButtonLink";
import OneLiner from "../assets/components/OneLiner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faReddit, faFacebook, faYoutube, faLinkedin, faTwitch, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { facebookUrl, githubUrl, linkedinUrl, redditUrl, twitchUrl, twitterUrl, youtubeUrl } from "../assets/scripts/constants";

export default function Index() {
	return (
		<div style={{ textAlign: "center" }}>
			<h1>Travis Martin</h1>
			<p><OneLiner /></p>
			<hr />
			<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
				<ButtonLink href={githubUrl}><FontAwesomeIcon icon={faGithub} /></ButtonLink>
				<ButtonLink href={redditUrl}><FontAwesomeIcon icon={faReddit} /></ButtonLink>
				<ButtonLink href={linkedinUrl}><FontAwesomeIcon icon={faLinkedin} /></ButtonLink>
				<ButtonLink href={twitchUrl}><FontAwesomeIcon icon={faTwitch} /></ButtonLink>
				<ButtonLink href={twitterUrl}><FontAwesomeIcon icon={faTwitter} /></ButtonLink>
				<ButtonLink href={facebookUrl}><FontAwesomeIcon icon={faFacebook} /></ButtonLink>
				<ButtonLink href={youtubeUrl}><FontAwesomeIcon icon={faYoutube} /></ButtonLink>
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

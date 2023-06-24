import style from "./style.module.scss";
import ButtonLink from "site/components/ButtonLink/index";
import { BsGithub, BsReddit, BsLinkedin, BsTwitch, BsTwitter, BsFacebook, BsYoutube } from "react-icons/bs";

export default function Socials(props) {
	return (
		<ul className={style["base"]} {...props}>
			<li><ButtonLink href="https://github.com/Lakuna"><BsGithub /></ButtonLink></li>
			<li><ButtonLink href="https://www.reddit.com/user/T3Lacuna"><BsReddit /></ButtonLink></li>
			<li><ButtonLink href="https://www.linkedin.com/in/t-j-m/"><BsLinkedin /></ButtonLink></li>
			<li><ButtonLink href="https://www.twitch.tv/lakuna0"><BsTwitch /></ButtonLink></li>
			<li><ButtonLink href="https://twitter.com/T3Lakuna"><BsTwitter /></ButtonLink></li>
			<li><ButtonLink href="https://www.facebook.com/profile.php?id=100027929321707"><BsFacebook /></ButtonLink></li>
			<li><ButtonLink href="https://www.youtube.com/channel/UC0AjiYU8DPKcBKUfIQoUGNg"><BsYoutube /></ButtonLink></li>
		</ul>
	);
}

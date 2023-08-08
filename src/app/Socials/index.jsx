import style from "./style.module.scss";
import ButtonLink from "#ButtonLink";
import { BsGithub, BsLinkedin, BsTwitch } from "react-icons/bs";

export default (props) => <ul className={style["base"]} {...props}>
	<li><ButtonLink href="https://github.com/Lakuna"><BsGithub /></ButtonLink></li>
	<li><ButtonLink href="https://www.linkedin.com/in/t-j-m/"><BsLinkedin /></ButtonLink></li>
	<li><ButtonLink href="https://www.twitch.tv/lakuna0"><BsTwitch /></ButtonLink></li>
</ul>;

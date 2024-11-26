import { BsGithub, BsLinkedin, BsTwitch } from "react-icons/bs";
import ButtonLink from "#ButtonLink";
import type { Props } from "#Props";
import style from "./socials.module.scss";

export default function Socials({
	className,
	...props
}: Props<HTMLUListElement>) {
	const socialsClassName = style["socials"];

	const fullClassName = socialsClassName
		? className
			? `${socialsClassName} ${className}`
			: socialsClassName
		: className;

	return (
		<ul className={fullClassName} {...props}>
			<li>
				<ButtonLink href="https://github.com/Lakuna">
					<BsGithub />
				</ButtonLink>
			</li>
			<li>
				<ButtonLink href="https://www.linkedin.com/in/t-j-m/">
					<BsLinkedin />
				</ButtonLink>
			</li>
			<li>
				<ButtonLink href="https://www.twitch.tv/lakuna0">
					<BsTwitch />
				</ButtonLink>
			</li>
		</ul>
	);
}

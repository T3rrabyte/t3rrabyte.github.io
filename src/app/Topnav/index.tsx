import DynamicLink from "#DynamicLink";
import type { DetailedHTMLProps, HTMLAttributes, JSX } from "react";
import style from "./style.module.scss";

export default function Topnav(
	props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
): JSX.Element {
	return (
		<nav className={style["base"]} {...props}>
			<ul>
				<li>
					<DynamicLink href="/">Index</DynamicLink>
				</li>
				<li>
					<DynamicLink href="/blog">Blog</DynamicLink>
				</li>
				<li>
					<DynamicLink href="/portfolio">Portfolio</DynamicLink>
				</li>
			</ul>
		</nav>
	);
}

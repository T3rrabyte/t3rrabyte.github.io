import DynamicLink from "../../shared/DynamicLink";
import style from "./topnav.module.scss";

export default function Topnav(props) {
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

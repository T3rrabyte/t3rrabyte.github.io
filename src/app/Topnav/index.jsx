import DynamicLink from "#DynamicLink";
import style from "./style.module.scss";

export default (props) => <nav className={style["base"]} {...props}>
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
</nav>;

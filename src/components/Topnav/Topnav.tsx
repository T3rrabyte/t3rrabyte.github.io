import Link from "#Link";
import type { Props } from "#Props";
import style from "./topnav.module.scss";

export default function Topnav({ className, ...props }: Props<HTMLElement>) {
	const topnavClassName = style["topnav"];

	const fullClassName = topnavClassName
		? className
			? `${topnavClassName} ${className}`
			: topnavClassName
		: className;

	return (
		<nav className={fullClassName} {...props}>
			<ul>
				<li>
					<Link href="/">{"Index"}</Link>
				</li>
				<li>
					<Link href="/blog">{"Blog"}</Link>
				</li>
				<li>
					<Link href="/portfolio">{"Portfolio"}</Link>
				</li>
			</ul>
		</nav>
	);
}

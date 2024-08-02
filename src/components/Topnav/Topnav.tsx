import Link from "#Link";
import type { Props } from "#Props";
import style from "./topnav.module.scss";

export default function Topnav({ className, ...props }: Props<HTMLElement>) {
	const topnavClassName = style["topnav"];

	const fullClassName =
		typeof topnavClassName === "undefined"
			? className
			: typeof className === "undefined"
				? topnavClassName
				: `${topnavClassName} ${className}`;

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

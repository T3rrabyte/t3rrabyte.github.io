import Link from "next/link";
import style from "./topnav.module.scss";

export default function Topnav() {
	return (
		<nav className={style["base"]}>
			<ul>
				<li>
					<Link href="/">Index</Link>
				</li>
				<li>
					<Link href="/blog">Blog</Link>
				</li>
				<li>
					<Link href="/portfolio">Portfolio</Link>
				</li>
			</ul>
		</nav>
	);
}

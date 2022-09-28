import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/topnav.module.scss";
import { useRef } from "react";

export default function TopNav() {
	const navRef = useRef(null);

	return (
		<nav className={styles["topnav"]} ref={navRef}>
			<ul>
				<li>
					<Link href="/">
						<a>Index</a>
					</Link>
					<Link href="/articles">
						<a>Articles</a>
					</Link>
					<Link href="/portfolio">
						<a>Portfolio</a>
					</Link>
					<button className={styles["dropdown-button"]} onClick={() => toggleExpandTopnav(navRef.current as unknown as Element)}>
						<FontAwesomeIcon icon={faBars} />
					</button>
				</li>
			</ul>
		</nav>
	);
}

function toggleExpandTopnav(topnav: Element) {
	if (topnav?.classList.contains(styles["expanded"])) {
		topnav.classList.remove(styles["expanded"]);
	} else {
		topnav?.classList.add(styles["expanded"])
	}
}

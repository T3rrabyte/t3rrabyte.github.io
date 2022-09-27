import styles from "../styles/card.module.scss";
import Link from "next/link";

export default function Card({ children, href, ...props }: any) {
	return href ? (
		<div className={styles["outer"]} {...props}>
			<Link href={href}>
				<a className={styles["outerlink"]}>
					<div className={styles["inner"]}>
						{children}
					</div>
				</a>
			</Link>
		</div>
	) : (
		<div className={styles["outer"]} {...props}>
			<div className={styles["inner"]}>
				{children}
			</div>
		</div>
	);
}

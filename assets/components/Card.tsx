import styles from "../styles/card.module.scss";
import Link from "next/link";

export default function Card(props) {
	return props.href ? (
		<div className={styles["outer"]} {...props}>
			<Link href={props.href}>
				<a className={styles["outerlink"]}>
					<div className={styles["inner"]}>
						{props.children}
					</div>
				</a>
			</Link>
		</div>
	) : (
		<div className={styles["outer"]} {...props}>
			<div className={styles["inner"]}>
				{props.children}
			</div>
		</div>
	);
}

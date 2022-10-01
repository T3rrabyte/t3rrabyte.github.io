import Link from "next/link";
import React from "react";
import styles from "../styles/buttonlink.module.scss";

export default function ButtonLink({ href, children }) {
	return (
		<Link href={href}>
			<a className={styles["buttonlink"]}>{children}</a>
		</Link>
	);
}

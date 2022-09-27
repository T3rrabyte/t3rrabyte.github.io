import Link from "next/link";
import React, { ReactElement } from "react";
import styles from "../styles/buttonlink.module.scss";

export default function ButtonLink({ href, children }: { href: string, children: (ReactElement | ReactElement[] | string | string[]) }) {
	return (
		<Link href={href}>
			<a className={styles["buttonlink"]}>{children}</a>
		</Link>
	);
}

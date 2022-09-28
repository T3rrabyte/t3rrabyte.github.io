import styles from "../styles/cardlist.module.scss";

export default function CardList({ children, ...props }) {
	return (
		<div className={styles["cardlist"]} {...props}>
			{children}
		</div>
	);
}

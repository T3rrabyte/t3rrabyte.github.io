import styles from "../styles/cardlist.module.scss";

export default function CardList({ children, ...props }: any) {
	return (
		<div className={styles["cardlist"]} {...props}>
			{children}
		</div>
	);
}

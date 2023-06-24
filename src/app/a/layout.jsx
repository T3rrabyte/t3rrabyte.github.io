import style from "./style.module.scss";

export default function Layout({ children }) {
	return (
		<article className={style["base"]}>
			{children}
		</article>
	);
}

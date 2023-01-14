import style from "./layout.module.scss";

export default function Layout({ children }) {
	return (
		<article className={style["base"]}>
			{children}
		</article>
	);
}

import style from "./style.module.scss";

export default ({ children }) => <article className={style["base"]}>
	{children}
</article>;

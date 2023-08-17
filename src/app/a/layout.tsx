import style from "./style.module.scss";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export default function layout({
	children
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>): JSX.Element {
	return <article className={style["base"]}>{children}</article>;
}

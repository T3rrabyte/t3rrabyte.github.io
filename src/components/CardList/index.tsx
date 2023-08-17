import style from "./style.module.scss";
import type { DetailedHTMLProps, HTMLAttributes, JSX } from "react";

export default function CardList({
	className = "",
	...props
}: DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>): JSX.Element {
	return <div className={`${style["base"]} ${className}`} {...props} />;
}

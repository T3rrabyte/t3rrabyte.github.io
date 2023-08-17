import DynamicLink from "#DynamicLink";
import type { AnchorHTMLAttributes, DetailedHTMLProps, JSX } from "react";
import style from "./style.module.scss";

export default function ButtonLink({
	className = "",
	...props
}: DetailedHTMLProps<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>): JSX.Element {
	return <DynamicLink className={`${style["base"]} ${className}`} {...props} />;
}

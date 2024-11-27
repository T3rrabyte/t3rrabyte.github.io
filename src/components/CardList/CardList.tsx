import type { JSX } from "react";
import style from "./card-list.module.scss";

export default function CardList({
	className,
	...props
}: JSX.IntrinsicElements["div"]) {
	const cardListClassName = style["card-list"];

	const fullClassName = cardListClassName
		? className
			? `${cardListClassName} ${className}`
			: cardListClassName
		: className;

	return <div className={fullClassName} {...props} />;
}

import type { Props } from "#Props";
import style from "./card-list.module.scss";

export default function CardList({
	className,
	...props
}: Props<HTMLDivElement>) {
	const cardListClassName = style["card-list"];

	const fullClassName =
		typeof cardListClassName === "undefined"
			? className
			: typeof className === "undefined"
				? cardListClassName
				: `${cardListClassName} ${className}`;

	return <div className={fullClassName} {...props} />;
}

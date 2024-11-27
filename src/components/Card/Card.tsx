import Link, { type LinkProps } from "#Link";
import type { JSX } from "react";
import style from "./card.module.scss";

export type CardProps =
	| (LinkProps & { href: LinkProps["href"] })
	| JSX.IntrinsicElements["div"];

export default function Card(props: CardProps) {
	const { children, className, ...restProps } =
		"className" in props
			? props
			: { children: void 0, className: void 0, ...props };
	const cardClassName = style["card"];
	const contentWrapperClassName = style["content-wrapper"];
	const fullClassName = cardClassName
		? className
			? `${cardClassName} ${className}`
			: cardClassName
		: className;

	const contentWrapper = (
		<div className={contentWrapperClassName}>{children}</div>
	);

	return "href" in restProps ? (
		<Link className={fullClassName} {...restProps}>
			{contentWrapper}
		</Link>
	) : (
		<div className={fullClassName} {...restProps}>
			{contentWrapper}
		</div>
	);
}

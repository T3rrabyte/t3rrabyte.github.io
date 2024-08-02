import Link, { type LinkProps } from "../Link";
import type { Props } from "#Props";
import style from "./card.module.scss";

export type CardProps = LinkProps | Props<HTMLDivElement>;

export default function Card({ className, children, ...props }: CardProps) {
	const cardClassName = style["card"];
	const contentWrapperClassName = style["content-wrapper"];

	const fullClassName =
		typeof cardClassName === "undefined"
			? className
			: typeof className === "undefined"
				? cardClassName
				: `${cardClassName} ${className}`;

	const contentWrapper = (
		<div className={contentWrapperClassName}>{children}</div>
	);

	return "href" in props ? (
		<Link className={fullClassName} {...props}>
			{contentWrapper}
		</Link>
	) : (
		<div className={fullClassName} {...props}>
			{contentWrapper}
		</div>
	);
}

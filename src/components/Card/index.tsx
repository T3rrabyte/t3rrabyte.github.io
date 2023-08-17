import style from "./style.module.scss";
import DynamicLink from "#DynamicLink";
import type {
	AnchorHTMLAttributes,
	DetailedHTMLProps,
	HTMLAttributes,
	JSX
} from "react";

export default function Card(
	props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		href?: string;
	}
): JSX.Element;

export default function Card(
	props: DetailedHTMLProps<
		AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	>
): JSX.Element;

export default function Card({
	className = "",
	href = "",
	children,
	...props
}:
	| (DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
			href?: string;
	  })
	| DetailedHTMLProps<
			AnchorHTMLAttributes<HTMLAnchorElement>,
			HTMLAnchorElement
	  >): JSX.Element {
	return href ? (
		<DynamicLink
			className={style["base"]}
			href={href}
			{...(props as DetailedHTMLProps<
				AnchorHTMLAttributes<HTMLAnchorElement>,
				HTMLAnchorElement
			>)}
		>
			<div className={style["content-wrapper"]}>{children}</div>
		</DynamicLink>
	) : (
		<div
			className={`${style["base"]} ${className}`}
			{...(props as DetailedHTMLProps<
				HTMLAttributes<HTMLDivElement>,
				HTMLDivElement
			>)}
		>
			<div className={style["content-wrapper"]}>{children}</div>
		</div>
	);
}

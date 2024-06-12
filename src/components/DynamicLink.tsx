import Link from "next/link";
import domain from "#domain";
import type { AnchorHTMLAttributes, DetailedHTMLProps, JSX } from "react";

export default function DynamicLink({
	href = "",
	...props
}: DetailedHTMLProps<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>): JSX.Element {
	return href.startsWith("/") ||
		href.startsWith(domain) ||
		href.startsWith("#") ? (
		<Link href={href} {...props} />
	) : (
		<a href={href} {...props} target="_blank" rel="noreferrer noopener" />
	);
}

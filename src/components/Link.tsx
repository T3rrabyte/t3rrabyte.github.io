import {
	default as NextLink,
	type LinkProps as NextLinkProps
} from "next/link";
import type { JSX } from "react";
import domain from "#domain";

// Equivalent to the props that can be passed to a Next.js link.
export type LinkProps = NextLinkProps | JSX.IntrinsicElements["a"];

export default function Link({
	href = "",
	onMouseEnter,
	onTouchStart,
	onClick,
	...props
}: LinkProps) {
	const hrefString = typeof href === "string" ? href : (href.href ?? "");

	// Events cannot be passed to client components.
	void onMouseEnter;
	void onTouchStart;
	void onClick;

	return hrefString.startsWith("/") ||
		hrefString.startsWith(domain) ||
		hrefString.startsWith("#") ? (
		<NextLink href={href} {...props} />
	) : (
		<a href={hrefString} {...props} target="_blank" rel="noreferrer noopener" />
	);
}

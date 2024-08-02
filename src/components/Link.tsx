import type {
	AnchorHTMLAttributes,
	DetailedHTMLProps,
	ReactNode,
	RefAttributes
} from "react";
import {
	default as NextLink,
	type LinkProps as NextLinkProps
} from "next/link";
import domain from "#domain";

// Equivalent to the props that can be passed to a Next.js link.
export type LinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof NextLinkProps
> &
	NextLinkProps & { children?: ReactNode } & RefAttributes<HTMLAnchorElement>;

// Props from a default HTML anchor element.
export type AnchorProps = DetailedHTMLProps<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>;

export default function Link({
	href = "",
	onMouseEnter,
	onTouchStart,
	onClick,
	...props
}: LinkProps | AnchorProps) {
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

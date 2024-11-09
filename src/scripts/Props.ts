import type {
	DetailedHTMLProps,
	HTMLAttributes,
	IframeHTMLAttributes,
	ReactNode
} from "react";

export type Props<T extends HTMLElement> = DetailedHTMLProps<
	HTMLAttributes<T>,
	T
>;

export type IframeProps = DetailedHTMLProps<
	IframeHTMLAttributes<HTMLIFrameElement>,
	HTMLIFrameElement
>;

export interface LayoutProps {
	children: ReactNode;
}

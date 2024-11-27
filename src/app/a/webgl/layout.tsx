import "#highlight";
import "#katex";
import type LayoutProps from "#LayoutProps";

export default function Layout({ children }: LayoutProps) {
	return children;
}

export const metadata = {
	title: {
		default: "Article",
		template: "%s | WebGL Tutorial | Lakuna"
	}
};

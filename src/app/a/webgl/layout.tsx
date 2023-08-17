import "#highlight";
import "#katex";
import type { ReactNode, JSX } from "react";

// TODO: Link to index and glossary on every page.

export default function layout({
	children
}: {
	children: ReactNode;
}): JSX.Element {
	return <>{children}</>;
}

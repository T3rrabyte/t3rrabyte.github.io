import DynamicLink from "#DynamicLink";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		a: (props) => <DynamicLink {...props} />,
		...components
	};
}

import DynamicLink from "site/components/DynamicLink";

export function useMDXComponents(components) {
	return {
		a: (props) => <DynamicLink {...props} />,
		code: (props) => <code className="language-" {...props} />, // Use Prism style on inline code.
		...components
	};
}

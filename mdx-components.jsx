import DynamicLink from "./app/DynamicLink";

export function useMDXComponents(components) {
	return {
		a: (props) => <DynamicLink {...props} />,
		...components
	};
}
